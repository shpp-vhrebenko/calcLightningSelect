<?php 



Class FTPClient  
{  

	private $connectionId;  //текущую FTP связь
	private $loginOk = false;  // статусы соединения
	private $messageArray = array(); //информационные сообщения

    // *** Переменныекласса
    public function __construct() { }  

    private function logMessage($message)  
	{  
	    $this->messageArray[] = $message;  
	}

	public function getMessages()  
	{  
	    return $this->messageArray;  
	}

	// сервер($server), имя пользователя ($ftpUser), пароль ($ftpPassword) - которая позволит установить связь.
	public function connect ($server, $ftpUser, $ftpPassword, $isPassive = false)  
	{
	    // *** Set up basic connection  
	    $this->connectionId = ftp_connect($server);  
	  
	    // *** Login with username and password  
	    $loginResult = ftp_login($this->connectionId, $ftpUser, $ftpPassword);  
	  
	    // *** Sets passive mode on/off (default off)  
	    ftp_pasv($this->connectionId, $isPassive);  
	  
	    // *** Check connection  
	    if ((!$this->connectionId) || (!$loginResult)) {  
	        $this->logMessage('FTP connection has failed!');  
	        $this->logMessage('Attempted to connect to ' . $server . ' for user ' . $ftpUser, true);  
	        return false;  
	    } else {  
	        $this->logMessage('Connected to ' . $server . ', for user ' . $ftpUser);  
	        $this->loginOk = true;  
	        return true;  
	    }  
	}

	public function downloadDir($dirTO) {		
		$contents = ftp_nlist($this->connectionId, '.');
		 // *** Set the transfer mode   
	    $asciiArray = array('txt', 'csv');	    		
		foreach ($contents as $fileFrom) {
			if ($fileFrom == '.' || $fileFrom == '..') {
				continue;
			}	
			$array = explode('.', $fileFrom);
		    $extension = end($array); 		        
		    if (in_array($extension, $asciiArray)) {   
		        $mode = FTP_ASCII;   
		    } else {   
		        $mode = FTP_BINARY;   
		    } 	
		    $fileTo = $dirTO.$fileFrom;	
			ftp_get($this->connectionId, $fileTo, $fileFrom, $mode);			
		}
		ftp_chdir($this->connectionId, '..');		
	}

	

	// метод для создания папки на сервере
	// путь с именем папки - $directory.
	public function makeDir($directory)   
	{   
	    // *** If creating a directory is successful...   
	    if (ftp_mkdir($this->connectionId, $directory)) {   
	        $this->logMessage('Directory "' . $directory . '" created successfully');   
	        return true; 
	    } else {   
	        // *** ...Else, FAIL.   
	        $this->logMessage('Failed creating directory "' . $directory . '"');   
	        return false;   
	    }   
	}

	//Загрузка файла
	//connectionId,
	// путь к папке на сервере ($fileTo),
	// путь к файлу на компьютере ($fileFrom),
	// режим ($mode).
	public function uploadFile ($fileFrom, $fileTo)   
	{   
	    // *** Set the transfer mode   
	    $asciiArray = array('txt', 'csv');   
	    $extension = end(explode('.', $fileFrom));   
	    if (in_array($extension, $asciiArray)) {   
	        $mode = FTP_ASCII;   
	    } else {   
	        $mode = FTP_BINARY;   
	    }   
	    // *** Upload the file   
	    $upload = ftp_put($this->connectionId, $fileTo, $fileFrom, $mode);   
	    // *** Check upload status   
	    if (!$upload) {   
	            $this->logMessage('FTP upload has failed!');   
	            return false;   
	        } else {   
	            $this->logMessage('Uploaded "' . $fileFrom . '" as "' . $fileTo);   
	            return true;   
	        }   
	}

	// изменения текущей директории на FTP сервере
	public function changeDir($directory)   
	{   
	    if (ftp_chdir($this->connectionId, $directory)) {   
	        $this->logMessage('Current directory is now: ' . ftp_pwd($this->connectionId));   
	        return true;   
	    } else {   
	        $this->logMessage('Couldn\'t change directory');   
	        return false;   
	    }   
	}

	//вывод содержимого текущей папки
	public function getDirListing($directory = '.', $parameters = '-la')   
	{   
	    // get contents of the current directory   
	    $contentsArray = ftp_nlist($this->connectionId, $directory);    
	    return $contentsArray;   
	}

	//Скачивание файла
	//conectionId,
	// путь и имя файла на компьютере (будет перезаписано при совпадении) - $fileTo,
	// путь и имя файла на сервере - $fileFrom,
	// режим - $mode.
	public function downloadFile ($fileFrom, $fileTo)   
	{   
		
	    // *** Set the transfer mode   
	    $asciiArray = array('txt', 'csv'); 
	    $array = explode('.', $fileFrom);
	    $extension = end($array); 		        
	    if (in_array($extension, $asciiArray)) {   
	        $mode = FTP_ASCII;   
	    } else {   
	        $mode = FTP_BINARY;   
	    }   
	   /* $contents = ftp_nlist($this->connectionId, ".");*/
	    // try to download $remote_file and save it to $handle   
	    if (ftp_get($this->connectionId, $fileTo, $fileFrom, $mode, 0)) {   
	    	$this->logMessage(' file "' . $fileTo . '" successfully downloaded');   
	        return true;	       
	    } else { 
	    	$this->logMessage('There was an error downloading file "' . $fileFrom . '" to "' . $fileTo . '"');   	    	
	        return false; 	         
	    }  
	}

	public function getCurDir() {
		return ftp_pwd($this->connectionId);
	}

	public function __destruct()   
	{   
	    if ($this->connectionId) {   
	        ftp_close($this->connectionId);   
	    }   
	}
}



?>
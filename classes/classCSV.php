<?php

/**
 * Класс для работы с csv-файлами 
 * @author дизайн студия ox2.ru  
 */
class CSV {
    
    private static $_csv_file = null;

     public static function Instance() {
        if(self::$_csv_file == null) {
            self::$_csv_file = new CSV();
        }
        return self::$_csv_file;
    }

    public function getCSV($file_instance_path) {
        $current_file_path = null;
        if (file_exists($file_instance_path)) { //Если файл существует
            $current_file_path = $file_instance_path; //Записываем путь к файлу в переменную
        }
        else throw new Exception("Файл \"$file_instance_path\" не найден"); //Если файл не найден то вызываем исключение

        $handle = fopen($current_file_path, "r"); //Открываем csv для чтения

        $array_line_full = array(); //Массив будет хранить данные из csv
        while (($line = fgetcsv($handle, 0, ";")) !== FALSE) { //Проходим весь csv-файл, и читаем построчно. 3-ий параметр разделитель поля
            $array_line_full[] = $line; //Записываем строчки в массив
        }
        fclose($handle); //Закрываем файл
        return $array_line_full; //Возвращаем прочтенные данные
    }

    /*private $_csv_file = null;*/

    /**
     * @param string $csv_file  - путь до csv-файла
     */
   /* public function __construct($csv_file) {
        if (file_exists($csv_file)) { //Если файл существует
            $this->_csv_file = $csv_file; //Записываем путь к файлу в переменную
        }
        else throw new Exception("Файл \"$csv_file\" не найден"); //Если файл не найден то вызываем исключение
    }*/

   

  /*  public function setCSV(Array $csv) {
        $handle = fopen($this->_csv_file, "a"); //Открываем csv для до-записи, если указать w, то  ифномация которая была в csv будет затерта

        foreach ($csv as $value) { //Проходим массив
            fputcsv($handle, explode(";", $value), ";"); //Записываем, 3-ий параметр - разделитель поля
        }
        fclose($handle); //Закрываем
    }*/

    /**
     * Метод для чтения из csv-файла. Возвращает массив с данными из csv
     * @return array;
     */
    /*public function getCSV() {
        $handle = fopen($this->_csv_file, "r"); //Открываем csv для чтения

        $array_line_full = array(); //Массив будет хранить данные из csv
        while (($line = fgetcsv($handle, 0, ";")) !== FALSE) { //Проходим весь csv-файл, и читаем построчно. 3-ий параметр разделитель поля
            $array_line_full[] = $line; //Записываем строчки в массив
        }
        fclose($handle); //Закрываем файл
        return $array_line_full; //Возвращаем прочтенные данные
    }*/

}

try {    

    /**
     * Запись новой информации в CSV
     */
   /* $arr = array("Антонов Б.А.;Админ OX2.ru;89031233333",
        "Колобков В.Б.;Босс OX2.ru;89162233333");
    $csv->setCSV($arr);*/
}
catch (Exception $e) { //Если csv файл не существует, выводим сообщение
    echo "Ошибка: " . $e->getMessage();
}
?>
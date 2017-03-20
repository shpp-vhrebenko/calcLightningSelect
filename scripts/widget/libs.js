//=============== FUNCTIONS for FUNCTIONAL ===========================

/**
 * [round number]
 * @param  {[number]} a [description]
 * @param  {[number]} b [description]
 * @return {[number]}   [description]
 */
function round(a,b) {
 b=b || 0;
 return Math.round(a*Math.pow(10,b))/Math.pow(10,b);
} 

/**
 * [get description]
 * @param  {[type]} ) {                   return Object.keys(this).length;    }} [description]
 * @return {[type]}   [description]
 */
Object.defineProperty(Object.prototype, "length", {
    enumerable: false,
    get: function() {
        return Object.keys(this).length;
    }
});
//=============== END FUNCTIONS for FUNCTIONAL ===========================
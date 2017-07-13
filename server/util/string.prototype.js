/**
 *去除两端空格 
 */
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
  
}
/**
 *去除html代码的 空格 回车，换行 
 */
String.prototype.trimCode=function(){
    return this.replace(/[\r\n\t]/g,"")
}
/**
 *去除左空格 
 */
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
}
/**
 *去除右空格 
 */
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");
}
/**
 *替换全部 
 * @param {Object} s1
 * @param {Object} s2
 */
String.prototype.replaceAll = function(s1,s2){ 
    return this.replace(new RegExp(s1,"gm"),s2); 
}

// RETORNA O MENOR NUMERO DO ARRAY
Array.prototype.min = function() {
    var min = 9999999999999;
    for (var i = 0, j = this.length; i < j; i++)
        if (this[i] < min) min = this[i];
    return min;
}

// RETORNA O MAIOR VALOR DO ARRAY
Array.prototype.max = function() {
    var max = 0;
    for (var i = 0, j = this.length; i < j; i++)
        if (this[i] > max) max = this[i];
    return max;
}

// ACHATA O ARRAY, OU SEJA, MOVE TODOS OS SUB ITENS DA HIERARQUIA DO ARRAY PARA SUA RAIZ
// EXEMPLO: O ARRAY [1,2,3,[4,[5,6]],7,8] SE TORNA [1,2,3,4,5,6,7,8]
Array.prototype.flatten = function() {
    var result = [];
    for (var i = 0, j = this.length; i < j; i++)
        if ($type(this[i]) == "array") result.extend(this[i].flatten());
        else result.extend([this[i]]);
    return result;
}

// CLONA UM ARRAY DE OBJETOS
Array.prototype.clone = function(){
    var aux = new Array();
    for (var i = 0, j = this.length; i < j; i++) {
        aux[i] = {};
        $extend(aux[i], this[i]);
    }
    return aux;
}

// IMPLEMENTACAO DO PROTOTYPE INDEXOF
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt)
    {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
        ? Math.ceil(from)
        : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

// SORTEAR UM ELEMENTO ALEATORIO DO ARRAY
Array.prototype.random = function (){
    return this[Math.floor(Math.random()*this.length)];
}

// REMOVER ELEMENTO DE ARRAY
Array.prototype.remove = function (item) {
    var auxArray = [];
    for(var i=0;i< this.length; i++){
        if(item !== this[i])
            auxArray.push(this[i]);
    }
    this.length = 0;
    for(i =0; i < auxArray.length; i++){
        this[i] = auxArray[i];
    }
}

// UMA VERSAO DE APPLY PARA ARRAY
Array.prototype.every = function(fn, bind){
    for (var i = 0, l = this.length >>> 0; i < l; i++){
        if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
    }
    return true;
}

// CONVERTE UM NUMERO PARA UMA STRING NO FORMATO DE MOEDA
// EXEMPLO: O NUMERO 10344.12 SE TORNA 10.344,12
Number.prototype.toCurrency = function() {
    var aux = this.toString();
    var result = "";

    if (!aux.contains(".") == true) {
        aux += ",00";
    } else {
        aux = aux.replace(".", ",");
    }

    for (var x = aux.length, d = 0; x >= 0; --x) {
        if (aux.charAt(x) == ",") {
            result = "," + result;
            d = 0;
        } else {
            if (d == 3 && !("-+").contains(aux.charAt(x))) {
                result = aux.charAt(x)+ "." + result;
                d = 0;
            } else {
                result = aux.charAt(x) + result;
            }
            d++;
        }
    }

    return result;
}

// RETORNA O LOGARITMO DE BASE "B" DO NUMERO
Number.prototype.logB = function (b) {
    if (b == null) b = 10;
    return (Math.log(this))/(Math.log(b));
}

// RETORNA ARREDONDAMENTO PARA CIMA
Number.prototype.ceil = function(precision){
    precision = Math.pow(10, precision || 0);
    return Math.ceil(this * precision) / precision;
}

// RETORNA ARREDONDAMENTO PARA BAIXO
Number.prototype.floor = function(precision){
    precision = Math.pow(10, precision || 0);
    return Math.floor(this * precision) / precision;
}

// RETORNA ARREDONDAMENTO MAIS PROXIMO
Number.prototype.round = function(precision){
    precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
    return Math.round(this * precision) / precision;
}
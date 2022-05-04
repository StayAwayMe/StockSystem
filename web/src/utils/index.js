/*
 * @Author: yanyong.yan 
 * @Date: 2021-03-09 15:21:34 
 * @Last Modified by: yanyong.yan
 * @Last Modified time: 2021-08-04 16:24:32
 */
import store from '../store';
export var INTERVALDURATION = 360000;

// antd-table列筛选支持
export function filterHelper(values, col_name) {
    let tmp = new Set();
    let resData = [];
    values.map((value, index) => {
        let _tmp = value[col_name];
        if (tmp.has(_tmp)) {
            return
        }
        tmp.add(_tmp)
        resData.push({ text: _tmp, value: _tmp })
    })
    return resData;
}

//集合差运算
export function setDifference(setA, setB) {
    const differenceSet = new Set()
    setA.forEach(value => {
        if (!setB.has(value)) {
            differenceSet.add(value)
        }
    })
    return differenceSet;
}

//交集运算
export function setIntersection(setA, setB) {
    const intersectionSet = new Set()
    if (setA.size > setB.size) {
        setA.forEach(value => {
            if (setB.has(value)) {
                intersectionSet.add(value)
            }
        })
    }
    setB.forEach(value => {
        if (setA.has(value)) {
            intersectionSet.add(value)
        }
    })
    return intersectionSet;
}

export function setUnion(setA, setB) {
    //并集运算
    const unionAb = new Set()
    setA.forEach(value => unionAb.add(value))
    setB.forEach(value => unionAb.add(value))
    return unionAb;
}

export function isDateFormat(dateStr) {
    var reg = /^[1-9]\d{3}[-,\/]([0]*[1-9]|1[0-2])[-,\/]([0]*[1-9]|[1-2][0-9]|3[0-1])$/;
    var regExp = new RegExp(reg);
    if (!regExp.test(dateStr)) {
        return false;
    }
    return true
}
export function isNumber(dateStr) {
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    var regExp = new RegExp(reg);
    if (!regExp.test(dateStr)) {
        return false;
    }
    return true
}

export function moneyFormat(number, decimals, dec_point, thousands_sep) {
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,

        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}


export function getUserByUserName(username) {
    let traders = store.getState()["trader"];
    return traders.find((obj) => obj.trader_name === username)
}

export function getUserByUserCode(usercode) {
    let traders = store.getState()["trader"];
    return traders.find((obj) => obj.trader_code === usercode)
}



export const strToFloat = (v, n = 4) => isNumber(v) ? parseFloat(parseFloat(v).toFixed(n)) : 0
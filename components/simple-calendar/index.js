module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Component({
  properties: {
    en: {
      type: Boolean,
      value: false
    },
    showOther: {
      type: Boolean,
      value: true
    },
    list: {
      type: Array,
      value: []
    },
    showChangeYear: {
      type: Boolean,
      value: true
    },
    initialDate: {
      type: String,
      observer(date) { if (date) this.initDate(date) }
    },
    startDate: {
      type: String,
      observer(date) { if (date) this.setData({ startDateTimestamp: this.getCurrentTime(this.serializeDate(date)) }) }
    }
  },
  data: {
    year: '',
    month: '',
    todayTimestamp: 0,
    datesArr: [],
    datesList: [], // 分组好的列表，渲染到页面
    selectedTimestamp: 0,
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    weeks_en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months_en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    jsonList: {}
  },

  lifetimes: {
    attached: function attached() {
      var year = new Date().getFullYear();
      var month = new Date().getMonth();
      this.setData({
        year: year,
        month: month,
        datesArr: this.getAllDates(year, month),
        todayTimestamp: this.getTodayTime()
      });
    }
  },
  observers: {
    datesArr: function datesArr(o) {
      this.setData({
        datesList: this.chunk(o, 7)
      });
    },
    list: function list(newVal) {
      var _this = this;

      if (newVal.length) {
        var arr = this.groupBy(newVal, function (item) {
          return [_this.formatDate(item.day)];
        });
        var newArr = arr.map(function (item) {
          var _ref;

          var key = _this.formatDate(item[0].day);
          return _ref = {}, _ref[key] = item, _ref;
        });
        var obj = {};
        newArr.forEach(function (o) {
          var key = Object.keys(o)[0];
          obj[key] = o[key];
        });
        this.setData({
          jsonList: obj
        });
      }
    }
  },
  methods: {
    /**
     * 获取当月的信息（返回当月第一天和最后一天的星期，以及当月总天数）
     * @param {*} year 年份
     * @param {*} month 月份（0-11）
     */
    getCurrentMonthInfo: function getCurrentMonthInfo(year, month) {
      var firstDate = new Date(year, month, 1);
      var lastDate = new Date(year, month + 1, 0);
      return {
        firstDay: firstDate.getDay(),
        lastDay: lastDate.getDay(),
        days: lastDate.getDate()
      };
    },

    /**
     * 获取当前展示的日期（包括上个月日期和下个月日期）,月份范围 0-11
     * @param {*} year 年份
     * @param {*} month 月份（0-11）
     */
    getAllDates: function getAllDates(year, month) {
      // 本月信息
      var thisMonthInfo = this.getCurrentMonthInfo(year, month);
      // 上月信息
      var prevMonthInfo = this.getCurrentMonthInfo(year, month - 1);
      var datesArr = [];
      // 向数组中添加当前月日期,m是标记，'cur'表示当前月，'prev'表示上个月，'next'表示下个月
      for (var i = 0; i < thisMonthInfo.days; i++) {
        datesArr.push({
          year: year,
          month: month,
          day: i + 1,
          date: year + '-' + (month + 1) + '-' + (i + 1),
          m: 'cur'
        });
      }
      // 向数组头部添加上个月日期
      for (var _i = 0; _i < thisMonthInfo.firstDay; _i++) {
        if (month === 0) {
          datesArr.unshift({
            year: year - 1,
            month: 11,
            day: prevMonthInfo.days - _i,
            date: year - 1 + '-12-' + (prevMonthInfo.days - _i),
            m: 'prev'
          });
        } else {
          datesArr.unshift({
            year: year,
            month: month - 1,
            day: prevMonthInfo.days - _i,
            date: year + '-' + month + '-' + (prevMonthInfo.days - _i),
            m: 'prev'
          });
        }
      }
      // 向数组尾部添加下个月日期
      for (var _i2 = 0; _i2 < 7 - thisMonthInfo.lastDay - 1; _i2++) {
        if (month === 11) {
          datesArr.push({
            year: year + 1,
            month: 0,
            day: _i2 + 1,
            date: year + 1 + '-1-' + (_i2 + 1),
            m: 'next'
          });
        } else {
          datesArr.push({
            year: year,
            month: month + 1,
            day: _i2 + 1,
            date: year + '-' + (month + 2) + '-' + (_i2 + 1),
            m: 'next'
          });
        }
      }
      return datesArr;
    },

    /**
     * 减年份
     */
    reduceYear: function reduceYear() {
      var year = this.data.year - 1;
      this.setData({
        year: year,
        datesArr: this.getAllDates(year, this.data.month)
      });
      this.triggerEvent('change', {
        year: year,
        month: this.data.month + 1
      }, {});
    },

    /**
     * 减月份
     */
    reduceMonth: function reduceMonth() {
      var month = this.data.month - 1;
      // 当month为-1时，年份应该减1，月份是12月
      if (month === -1) {
        var year = this.data.year - 1;
        this.setData({
          year: year,
          month: 11,
          datesArr: this.getAllDates(year, 11)
        });
        this.triggerEvent('change', {
          year: year,
          month: 12 // 这里返回已+1
        }, {});
      } else {
        this.setData({
          month: month,
          datesArr: this.getAllDates(this.data.year, month)
        });
        this.triggerEvent('change', {
          year: this.data.year,
          month: month + 1
        }, {});
      }
    },

    /**
     * 加年份
     */
    addYear: function addYear() {
      var year = this.data.year + 1;
      this.setData({
        year: year,
        datesArr: this.getAllDates(year, this.data.month)
      });
      this.triggerEvent('change', {
        year: year,
        month: this.data.month + 1
      }, {});
    },

    /**
     * 加月份
     */
    addMonth: function addMonth() {
      var month = this.data.month + 1;
      // 当month为12时，年份应该加1，月份为1月
      if (month === 12) {
        var year = this.data.year + 1;
        this.setData({
          year: year,
          month: 0,
          datesArr: this.getAllDates(year, 0)
        });
        this.triggerEvent('change', {
          year: year,
          month: 1 // 已+1
        }, {});
      } else {
        this.setData({
          month: month,
          datesArr: this.getAllDates(this.data.year, month)
        });
        this.triggerEvent('change', {
          year: this.data.year,
          month: month + 1
        }, {});
      }
    },

    /**
     * 获取时间戳
     * @param {*} d 每一天的信息
     */
    getCurrentTime: function getCurrentTime(d) {
      return new Date(d.year, d.month, d.day).getTime();
    },

    /**
     * 计算今天的时间戳
     */
    getTodayTime: function getTodayTime() {
      var today = new Date();
      var d = {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate()
      };
      return this.getCurrentTime(d);
    },

    /**
     * 将数组分块
     * @param {*} arr 目标数组
     * @param {*} size 块长度
     */
    chunk: function chunk(arr, size) {
      return Array.from({ length: Math.ceil(arr.length / size) }, function (v, i) {
        return arr.slice(i * size, i * size + size);
      });
    },

    /**
     *  分组
     * @param {*} arr 目标数组
     * @param {*} fn 函数
     */
    groupBy: function groupBy(arr, fn) {
      var groups = {};
      arr.forEach(function (o) {
        var group = JSON.stringify(fn(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
    },

    /**
     * 统一日期格式
     * @param {*} e
     */
    formatDate: function formatDate(s) {
      var arr = s.split('-');
      var m = parseInt(arr[1], 10);
      var d = parseInt(arr[2], 10);
      return arr[0] + '-' + m + '-' + d;
    },

    // 选中日期
    selectDate: function selectDate(e) {
      var list = e.currentTarget.dataset.list;
      var item = e.currentTarget.dataset.obj;
      if (item.m === 'prev') {
        this.reduceMonth();
      } else if (item.m === 'next') {
        this.addMonth();
      }
      this.setDate(item, list)
    },

    setDate(dateObj, list=[]) {
      this.setData({
        selectedTimestamp: this.getCurrentTime(dateObj),
        selectedDate: {
          year: dateObj.year,
          month: dateObj.month + 1,
          day: dateObj.day,
          date: dateObj.date,
          list: list
        }
      });
      // this.triggerEvent('select', date, {});
    },

    getFullDate() {
      return this.data.selectedDate
    },

    serializeDate(date) {
      const dateInstance = new Date(date)
      const formattedDate = {}
      formattedDate.date = date
      formattedDate.day = dateInstance.getDate()
      formattedDate.month = dateInstance.getMonth()
      formattedDate.year = dateInstance.getFullYear()
      formattedDate.m =  'cur'
      return formattedDate
    },

    initDate(date) {
      const fullDate = this.serializeDate(date)
      this.setDate(fullDate)
      setTimeout(() => {
        this.setData({ 
          year: fullDate.year,
          month: fullDate.month,
          datesArr: this.getAllDates(fullDate.year, fullDate.month)
        })
      }, 100);
    }
  }
});

/***/ })
/******/ ]);
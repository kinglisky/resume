// 这里是技能点图表信息
var ChartDatas = {
	"#code-intr": {
		labels: ["JavaScript 80%", "CSS 70%", "Node 65%", "Less 65%", "AS3.0 60%", "HTML 70%"],
		datasets: [
			{
				label: "主要技能",
				fillColor: "rgba(59, 187, 203, 0.62)",
				strokeColor: "rgb(172, 172, 172)",
				pointColor: "#F9927E",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: [80, 70, 65, 65, 60, 70]
        }
    ]
	},
	"#design-intr": {
		labels: ["PS 75%", "AI 75%", "Axure 70%", "Tiled 80%", "Flash 85%"],
		datasets: [
			{
				label: "设计软件",
				fillColor: "rgba(59, 187, 203, 0.62)",
				strokeColor: "rgb(172, 172, 172)",
				pointColor: "#F9927E",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: [70, 75, 70, 80, 85]
        }
    ]
	},
	"#library-intr": {
		labels: ["jQuery 80%", "Bootstrp 70%", "Modernizr 65%", "Quintus 85%"],
		datasets: [
			{
				label: "常用框架",
				fillColor: "rgba(59, 187, 203, 0.62)",
				strokeColor: "rgb(172, 172, 172)",
				pointColor: "#F9927E",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: [80, 70, 65, 85]
        }
    ]
	},
	"#database-intr": {
		labels: ["MySQL 75%", "SQLite 65%", "MongoDB 50%"],
		datasets: [
			{
				label: "使用过的数据库",
				fillColor: "rgba(59, 187, 203, 0.62)",
				strokeColor: "rgb(172, 172, 172)",
				pointColor: "#F9927E",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: [75, 65, 50]
        }
    ]
	},
	"#tools-intr": {
		labels: ["Brackets 90%", "Sublime 85%", "GIT 75%"],
		datasets: [
			{
				label: "开发工具",
				fillColor: "rgba(59, 187, 203, 0.62)",
				strokeColor: "rgb(172, 172, 172)",
				pointColor: "#F9927E",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: [90, 85, 75]
        }
    ]
	},
};
$(document).ready(function () {
	var ME = {
		DEFAULT: {
			dtime: 800,
			easing: 'swing'
		},
		DOM: {
			$viewContent: $('.view-content'),
			$contentBox: $('.content-box'),
			$menu: $('#menu'),
			$body: $('html, body'),
			$skillsTagWrapper: $('#skills-tag-wrapper'),
			$chartCanvas: $('#skills-canvas'),
			$introduceWrapper: $('#introduce-wrapper')
		},
		USE: {
			currIndex: 0,
			currId: '#home',
			menuList: ['#home', '#about-me', '#skills', '#project', '#contact-me'],
			currChartID: null,
			timer: null

		},
		METHODS: {

		}
	}


	// 让页面滚到目标位置的
	ME.METHODS.scrollTo = function ($dest, dt, easing) {
		if (!$dest) return console.log('目标不存在！');
		ME.DOM.$body.animate({
			scrollTop: $dest.offset().top
		}, dt || ME.DEFAULT.dtime, easing || ME.DEFAULT.easing);

	}


	// 用于改变导航条状态的
	ME.METHODS.markActive = function ($parent, $currActive, select) {
		var $list = select ? $parent.find(select) : $parent.children();
		$list.removeClass('active');
		$currActive.addClass('active');
	}


	// 初始化图标插件，返回一个函数用于图标的渲染
	ME.METHODS.initChart = function ($canvas) {
		var chart = new Chart($canvas.get(0).getContext('2d')),
			radar = null,
			renderMark = false;
		return function (data) {
			radar && radar.destroy();
			radar = chart.Radar(data);


		}
	}


	// 这个方法用于图表的渲染
	ME.METHODS.renderChart = ME.METHODS.initChart(ME.DOM.$chartCanvas);



	$.stellar();
	ME.DOM.$viewContent.parallax();
	ME.DOM.$contentBox.parallax();

	// 滚动对应改变导航条转态,这里采用函数节流
	$(window).scroll(function (event) {
		if (ME.USE.timer) return;
		ME.USE.timer = setTimeout(function () {
			var markTop = $(ME.USE.currId).offset().top,
				scrollTop = $(this).scrollTop(),
				dist = (scrollTop - markTop) | 0,
				d = 0,
				$currActive;
			if (dist !== 0&&Math.abs(dist)>300) {
				d = dist > 0 ? 1 : -1;
				ME.USE.currIndex+=d;
				ME.USE.currId=ME.USE.menuList[ME.USE.currIndex];
				$currActive=ME.DOM.$menu.find('li>a.pmark').eq(ME.USE.currIndex);
				ME.METHODS.markActive(ME.DOM.$menu, $currActive, 'li>a.pmark');
			}
			ME.USE.timer = null;
		}, 500);
	});

	// 单击滚动导航滚动到指定位置
	ME.DOM.$menu.on('click', 'li>a.pmark', function (evet) {
		evet.preventDefault();
		var $self = $(this),
			destId = $self.attr('href');
		if (ME.USE.currId === destId) return;
		ME.USE.currId = destId;
		ME.USE.currIndex = ME.USE.menuList.indexOf(destId);
		ME.METHODS.scrollTo($(destId));
		ME.METHODS.markActive(ME.DOM.$menu, $self, 'li>a.pmark');
	});
	// 技能点得显示
	ME.DOM.$skillsTagWrapper.on('click', 'div.tag', function (event) {
		var $self = $(this),
			introduceID = $self.data('intr-id');
		if (introduceID && introduceID !== ME.USE.currChartID) {
			ME.USE.currChartID = introduceID;
			//渲染图表
			var data = ChartDatas[introduceID];
			ME.METHODS.renderChart(data);
			// 添加技能说明
			ME.DOM.$introduceWrapper.html($(introduceID).html());
			ME.METHODS.markActive(ME.DOM.$skillsTagWrapper, $self);

		}

	});
	(function init() {
		ME.DOM.$skillsTagWrapper.find('.active').trigger('click');
		ME.USE.currChartID = '#code-intr';

	})();
});

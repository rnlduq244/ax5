// ax5.ui.calendar
(function(root, ax_super) {
	/**
	 * @class ax5.ui.calendar
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-21 tom : 시작
	 * @example
	 * ```
	 * var my_pad = new ax5.ui.calendar();
	 * ```
	 */
	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				click_event_name: (('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				theme: 'default',
				mode: 'day', // day|month|year,
				date_format: 'yyyy-mm-dd',
				display_date: (new Date())
			};
		}).apply(this, arguments);

		this.target = null;
		var cfg = this.config;
		var a_day = 1000 * 60 * 60 * 24;

		/**
		 * Preferences of calendar UI
		 * @method ax5.ui.calendar.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.calendar}
		 * @example
		 * ```
		 * set_config({
		 *      target : {Element|AX5 nodelist}, // 메뉴 UI를 출력할 대상
		 *      mode: {String}, // [day|month|year] - 화면 출력 모드
		 *      onclick: {Function} // [onclick] - 아이템 클릭이벤트 처리자
		 * });
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			//console.log(this.config);
			if(!cfg.target){
				U.error("aui_calendar_400", "[ax5.ui.calendar] config.target is required");
			}
			this.target = ax5.dom(cfg.target);

			this.target.html( this.get_frame() );

			// 파트수집
			this.els = {
				"root": this.target.find('[data-calendar-els="root"]')
			};

			this.print(cfg.mode, cfg.display_date);
		};

		this.get_frame = function(){
			var po = [];
			po.push('<div class="ax5-ui-calendar ' + cfg.theme + '" data-calendar-els="root">');
			po.push('</div>');
			return po.join('');
		};

		this.print = function(mode, now_date){
			var
				dot_date = U.date(now_date),
				po = [],
				month_start_date = new Date(dot_date.getFullYear(), dot_date.getMonth(), 1, 12),
				table_start_date = (function(){
					var day = month_start_date.getDay();
					if (day == 0) day = 7;
					return U.date(month_start_date, {add:{d:-day}});
				})(),
				loop_date,
				this_month = dot_date.getMonth(),
				i, k;

			po.push('<table data-calendar-table="' + mode + '">');
			po.push('<thead>');
				po.push('<tr>');
				k = 0; while (k < 7) {
					po.push('<td>');
					po.push( ax5.info.week_names[k].label );
					po.push('</td>');
					k++;
				}
				po.push('</tr>');
			po.push('</thead>');
			po.push('<tbody>');
				loop_date = table_start_date;
				i = 0; while (i < 6) {
					po.push('<tr>');
					k = 0; while (k < 7) {
						po.push('<td>');
						po.push('<a data-calendar-item-date="' + U.date(loop_date, {return:cfg.date_format}) + '">' + loop_date.getDate() + '</a>')
						po.push('</td>');
						k++;
						loop_date = U.date(loop_date, {add:{d:1}});
					}
					po.push('</tr>');
					i++;
				}
			po.push('</tbody>');
			po.push('</table>');

			this.els["root"].html( po.join('') );
			this.els["root"].find('[data-calendar-item-date]').on(cfg.click_event_name, (function(e){
				this.onclick(e||window.event);
			}).bind(this));
		};

		this.onclick = function(e, target, value){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-calendar-item-date")){
					return true;
				}
			});
			if(target){
				value = axd.attr(target, "data-calendar-item-date");
				if(this.config.onclick){
					this.config.onclick.call({
						date: value,
						target: this.target.elements[0],
						item_target: target
					});
				}
			}
		};
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.calendar = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_calendar", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);
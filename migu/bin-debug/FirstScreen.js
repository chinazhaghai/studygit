var FirstScreen = (function (_super) {
    __extends(FirstScreen, _super);
    function FirstScreen() {
        _super.call(this);
        this.angle = 0;
        this.c_x = 0;
        this.c_y = 0;
        this.c_r = 0;
        this.resArr = [77, 77, 77, 77, 77];
        this.createElement();
    }
    var d = __define,c=FirstScreen,p=c.prototype;
    p.onAddToStage = function () {
    };
    p.createElement = function () {
        var self = this;
        /*背景*/
        this.bg = this.getImage("bg_jpg");
        this.setPosition(this.bg, 0, 0);
        this.addChildAt(this.bg, 0);
        /*标识*/
        this.logo = this.getImage("logo_png");
        this.setPosition(this.logo, 17, 18);
        this.addChildAt(this.logo, -1);
        /*时钟*/
        this.clock = this.getImage('clock_png');
        this.setCenter(this.clock, 'both');
        this.setPosition(this.clock, 42, 27);
        this.addChild(this.clock);
        egret.Tween.get(this.clock)
            .to({ rotation: 0, scaleX: 1.66, scaleY: 1.66, alpha: 0 })
            .to({ rotation: 30, scaleX: 1, scaleY: 1, alpha: 1 }, 1300);
        /*标题*/
        this.title = this.getImage('title_png');
        this.setCenter(this.title, 'both');
        this.setPosition(this.title, 199, 250);
        this.addChild(this.title);
        egret.Tween.get(this.title)
            .to({ scaleX: .8, scaleY: .8, alpha: 0 })
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 1300).call(function () {
            self.touchEnabled = true;
        });
        /*旋转指示*/
        this.arrow = this.getImage('arrow_png');
        this.setPosition(this.arrow, 76, 779);
        this.addChild(this.arrow);
        /*btn 1300*/
        this.btn = this.getImage('btn_png');
        this.setPosition(this.btn, 254, 229);
        this.addChild(this.btn);
        this._mask = new egret.Shape;
        this.c_r = 444; //444
        this.c_x = 589;
        this.c_y = 518;
        this.angle = 90;
        this._mask.x = this.c_x;
        this._mask.y = this.c_y;
        var mg = this._mask.graphics;
        mg.beginFill(0xff0000);
        mg.lineTo(0, -this.c_r);
        mg.drawArc(0, 0, this.c_r, 90 * Math.PI / 180, Math.PI * this.angle / 180, false);
        mg.lineTo(0, 0);
        mg.endFill();
        this.addChild(this._mask);
        this.btn.mask = this._mask;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFirstQuestion, this);
        /*点击屏幕的时候，时钟旋转*/
        this.once(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(self.clock).to({ rotation: self.clock.rotation + 360 }, 1400, egret.Ease.quadInOut);
            egret.Tween.get(self.title).to({ alpha: 0 }, 300).call(function () {
                self.removeChild(self.title);
            });
            setTimeout(function () {
                self.addEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
            }, 100);
        }, this);
    };
    p.onEnterFrame = function () {
        if (this.angle > 270) {
            this.btn.touchEnabled = true;
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            return;
        }
        var mg = this._mask.graphics;
        mg.clear();
        mg.beginFill(0x000000);
        mg.lineTo(0, -this.c_r);
        mg.drawArc(0, 0, this.c_r, 90 * Math.PI / 180, Math.PI * this.angle / 180, false);
        mg.lineTo(0, 0);
        mg.endFill();
        this.angle += 4.5;
    };
    p.onFirstQuestion = function () {
        var self = this;
        egret.Tween.get(this.btn).to({ alpha: 0 }, 400).call(function () {
            self.removeChild(self.btn);
        });
        egret.Tween.get(this.arrow).to({ alpha: 0 }, 400).call(function () {
            self.removeChild(self.arrow);
        });
        egret.Tween.get(this.clock).to({ scaleX: .55, scaleY: .55, x: 321, y: 501, rotation: 360 }, 1600, egret.Ease.quadInOut);
        this.f_page = new egret.Sprite;
        var fg = this.f_page.graphics;
        fg.beginFill(0x000000, 0);
        fg.drawRect(0, 0, 640, 1000);
        fg.endFill();
        this.addChild(this.f_page);
        var f_title = this.getImage('first-question-title_png');
        this.f_page.addChild(f_title);
        egret.Tween.get(f_title).to({ x: 151, y: 61, alpha: 0 }).wait(1400).to({ x: 151, y: 51, alpha: 1 }, 500);
        var f_pic = this.getImage('first-question_png');
        this.f_page.addChild(f_pic);
        this.setPosition(f_pic, 136, 316);
        egret.Tween.get(f_pic).to({ alpha: 0 }).wait(1400).to({ alpha: 1 }, 500);
        var next = this.getImage('next-btn_jpg');
        this.f_page.addChild(next);
        this.setPosition(next, 0, 898);
        egret.Tween.get(next).to({ alpha: 0 }).wait(1400).to({ alpha: 1 }, 500);
        next.touchEnabled = true;
        next.once(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(f_title).to({ alpha: 0 }, 400).call(function () {
                self.removeChild(self.f_page);
            });
            egret.Tween.get(f_pic).to({ alpha: 0 }, 100);
            egret.Tween.get(timeline).to({ alpha: 0 }, 100);
            egret.Tween.get(indicater).to({ alpha: 0 }, 100);
            self.onSecondQuestion();
        }, this);
        var indicater = this.getImage('indicater_png');
        this.f_page.addChild(indicater);
        this.setPosition(indicater, 77, 789);
        egret.Tween.get(indicater).to({ alpha: 0 }).wait(1400).to({ alpha: 1 }, 500);
        var timeline = this.getImage('first-timeline_png');
        this.f_page.addChild(timeline);
        this.setPosition(timeline, 64, 806);
        egret.Tween.get(timeline).to({ alpha: 0 }).wait(1400).to({ alpha: 1 }, 500);
        this.addTimeLine(timeline, indicater, 0);
    };
    p.onSecondQuestion = function () {
        var self = this;
        this.s_page = new egret.Sprite;
        var fg = this.s_page.graphics;
        fg.beginFill(0x000000, 0);
        fg.drawRect(0, 0, 640, 1000);
        fg.endFill();
        this.addChild(this.s_page);
        var s_title = this.getImage('second-question-title_png');
        this.s_page.addChild(s_title);
        this.setPosition(s_title, 167, 51);
        var s_pic = this.getImage('second-question_png');
        this.s_page.addChild(s_pic);
        this.setPosition(s_pic, 136, 296);
        var _mask = new egret.Sprite;
        var _mg = _mask.graphics;
        _mg.beginFill(0x000000);
        _mg.drawEllipse(0, 0, 366, 389);
        _mg.endFill();
        _mask.x = 136;
        _mask.y = 296;
        this.s_page.addChild(_mask);
        s_pic.mask = _mask;
        var next = this.getImage('next-btn_jpg');
        this.s_page.addChild(next);
        this.setPosition(next, 0, 898);
        var indicater = this.getImage('indicater_png');
        this.s_page.addChild(indicater);
        this.setPosition(indicater, 75, 788);
        var timeline = this.getImage('second-timeline_png');
        this.s_page.addChild(timeline);
        this.setPosition(timeline, 59, 806);
        egret.Tween.get(this.clock).to({ rotation: 360 }, 1200, egret.Ease.quadInOut).call(function () {
            next.touchEnabled = true;
        });
        egret.Tween.get(s_title).to({ alpha: 0, y: 61 }).wait(300).to({ alpha: 1, y: 51 }, 500);
        egret.Tween.get(s_pic).to({ y: 685 }).wait(300).to({ y: 296 }, 900); //685
        egret.Tween.get(timeline).to({ alpha: 0 }).to({ alpha: 1 }, 300);
        egret.Tween.get(indicater).to({ alpha: 0 }).to({ alpha: 1 }, 300);
        next.once(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(s_title).to({ alpha: 0 }, 400).call(function () {
                self.removeChild(self.s_page);
            });
            egret.Tween.get(s_pic).to({ alpha: 0 }, 100);
            egret.Tween.get(timeline).to({ alpha: 0 }, 100);
            egret.Tween.get(indicater).to({ alpha: 0 }, 100);
            self.onThirdQuestion();
        }, this);
        this.addTimeLine(timeline, indicater, 1);
    };
    p.onThirdQuestion = function () {
        var self = this;
        this.t_page = new egret.Sprite;
        var fg = this.t_page.graphics;
        fg.beginFill(0x000000, 0);
        fg.drawRect(0, 0, 640, 1000);
        fg.endFill();
        this.addChild(this.t_page);
        var t_title = this.getImage('third-question-title_png');
        this.t_page.addChild(t_title);
        this.setPosition(t_title, 188, 47);
        var t_pic = this.getImage('third-question_png');
        this.t_page.addChild(t_pic);
        this.setPosition(t_pic, 87, 335);
        var _mask = new egret.Sprite;
        var _mg = _mask.graphics;
        _mg.beginFill(0x000000);
        _mg.drawEllipse(0, 0, 504, 389);
        _mg.endFill();
        _mask.x = 136;
        _mask.y = 296;
        this.t_page.addChild(_mask);
        t_pic.mask = _mask;
        var next = this.getImage('next-btn_jpg');
        this.t_page.addChild(next);
        this.setPosition(next, 0, 898);
        var indicater = this.getImage('indicater_png');
        this.t_page.addChild(indicater);
        this.setPosition(indicater, 78, 789);
        var timeline = this.getImage('third-timeline_png');
        this.t_page.addChild(timeline);
        this.setPosition(timeline, 64, 806);
        egret.Tween.get(t_title).to({ alpha: 0, y: 61 }).wait(300).to({ alpha: 1, y: 51 }, 500);
        egret.Tween.get(t_pic).to({ x: -369 }).wait(300).to({ x: 87 }, 900); //685
        egret.Tween.get(timeline).to({ alpha: 0 }).to({ alpha: 1 }, 300);
        egret.Tween.get(indicater).to({ alpha: 0 }).to({ alpha: 1 }, 300);
        egret.Tween.get(this.clock).to({ rotation: 360 }, 1200, egret.Ease.quadInOut).call(function () {
            next.touchEnabled = true;
        });
        next.once(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(t_title).to({ alpha: 0 }, 400).call(function () {
                self.removeChild(self.t_page);
            });
            egret.Tween.get(t_pic).to({ alpha: 0 }, 100);
            egret.Tween.get(timeline).to({ alpha: 0 }, 100);
            egret.Tween.get(indicater).to({ alpha: 0 }, 100);
            self.onFourthQuestion();
        }, this);
        this.addTimeLine(timeline, indicater, 2);
    };
    p.onFourthQuestion = function () {
        var self = this;
        this.ft_page = new egret.Sprite;
        var fg = this.ft_page.graphics;
        fg.beginFill(0x000000, 0);
        fg.drawRect(0, 0, 640, 1000);
        fg.endFill();
        this.addChild(this.ft_page);
        var ft_title = this.getImage('forth-question-title_png');
        this.ft_page.addChild(ft_title);
        this.setPosition(ft_title, 117, 91);
        var ft_pic = this.getImage('forth-question_png');
        this.ft_page.addChild(ft_pic);
        this.setPosition(ft_pic, 181, 412);
        var _mask = new egret.Sprite;
        var _mg = _mask.graphics;
        _mg.beginFill(0x000000);
        _mg.drawEllipse(0, 0, 504, 420);
        _mg.endFill();
        _mask.x = 136;
        _mask.y = 296;
        this.ft_page.addChild(_mask);
        ft_pic.mask = _mask;
        var next = this.getImage('next-btn_jpg');
        this.ft_page.addChild(next);
        this.setPosition(next, 0, 898);
        var indicater = this.getImage('indicater_png');
        this.ft_page.addChild(indicater);
        this.setPosition(indicater, 77, 789);
        var timeline = this.getImage('first-timeline_png');
        this.ft_page.addChild(timeline);
        this.setPosition(timeline, 64, 806);
        egret.Tween.get(ft_title).to({ alpha: 0, y: 61 }).wait(300).to({ alpha: 1, y: 51 }, 500);
        egret.Tween.get(ft_pic).to({ y: 0 }).wait(300).to({ y: 412 }, 900); //685
        egret.Tween.get(timeline).to({ alpha: 0 }).to({ alpha: 1 }, 300);
        egret.Tween.get(indicater).to({ alpha: 0 }).to({ alpha: 1 }, 300);
        egret.Tween.get(this.clock).to({ rotation: 360 }, 1200, egret.Ease.quadInOut).call(function () {
            next.touchEnabled = true;
        });
        next.once(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(ft_title).to({ alpha: 0 }, 400).call(function () {
                self.removeChild(self.ft_page);
            });
            egret.Tween.get(ft_pic).to({ alpha: 0 }, 100);
            egret.Tween.get(timeline).to({ alpha: 0 }, 100);
            egret.Tween.get(indicater).to({ alpha: 0 }, 100);
            self.onFifthQuestion();
        }, this);
        this.addTimeLine(timeline, indicater, 3);
    };
    p.onFifthQuestion = function () {
        var self = this;
        this.ff_page = new egret.Sprite;
        var fg = this.ff_page.graphics;
        fg.beginFill(0x000000, 0);
        fg.drawRect(0, 0, 640, 1000);
        fg.endFill();
        this.addChild(this.ff_page);
        var timeline = this.getImage('first-timeline_png');
        this.ff_page.addChild(timeline);
        this.setPosition(timeline, 64, 806);
        var indicater = this.getImage('indicater_png');
        this.ff_page.addChild(indicater);
        this.setPosition(indicater, 77, 789);
        var ff_title = this.getImage('fifth-question-title_png');
        this.ff_page.addChild(ff_title);
        this.setPosition(ff_title, 109, 91);
        var textWrapper = new egret.Sprite;
        var tg = textWrapper.graphics;
        tg.lineStyle(1, 0x9f8952);
        tg.drawRect(0, 0, 296, 78);
        tg.endFill();
        this.ff_page.addChild(textWrapper);
        textWrapper.x = 173;
        textWrapper.y = 462;
        var text = new egret.TextField;
        text.width = 296;
        text.height = 78;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.size = 38;
        text.textColor = 0xa78e59;
        text.bold = true;
        text.type = egret.TextFieldType.INPUT;
        text.inputType = egret.TextFieldInputType.TEXT;
        text.maxChars = 4;
        text.text = '弄啥嘞';
        textWrapper.addChild(text);
        text.addEventListener(egret.Event.FOCUS_IN, function () {
            (window['closeOrient'] || function () { })();
            text.text = '';
        }, this);
        var next = this.getImage('result-btn_jpg');
        this.ff_page.addChild(next);
        this.setPosition(next, 0, 898);
        egret.Tween.get(ff_title).to({ alpha: 0, y: 61 }).wait(300).to({ alpha: 1, y: 51 }, 500);
        egret.Tween.get(textWrapper).to({ alpha: 0 }).wait(300).to({ alpha: 1 }, 300); //685
        egret.Tween.get(timeline).to({ alpha: 0 }).to({ alpha: 1 }, 300);
        egret.Tween.get(indicater).to({ alpha: 0 }).to({ alpha: 1 }, 300);
        egret.Tween.get(this.clock).to({ rotation: 360 }, 1200, egret.Ease.quadInOut).call(function () {
            next.touchEnabled = true;
        });
        next.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (text.text == '' || text.text == '弄啥嘞') {
                window['error']();
                return;
            }
            egret.Tween.get(ff_title).to({ alpha: 0 }, 400).call(function () {
                self.removeChild(self.ff_page);
            });
            egret.Tween.get(textWrapper).to({ alpha: 0 }, 100);
            egret.Tween.get(timeline).to({ alpha: 0 }, 100);
            egret.Tween.get(indicater).to({ alpha: 0 }, 100);
            egret.Tween.get(next).to({ y: 1000 }, 100);
            self.handleRes(text.text);
        }, this);
        this.addTimeLine(timeline, indicater, 4);
    };
    p.addTimeLine = function (timeline, indicater, _index) {
        timeline.touchEnabled = true;
        var self = this;
        var start_x = 0;
        var move_x = 0;
        var end_x = 0;
        timeline.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            start_x = move_x = end_x = e.stageX;
        }, this);
        timeline.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) {
            end_x = e.stageX;
            var diff = end_x - move_x;
            var current = indicater.x + diff;
            if (current <= 77) {
                current = 77;
            }
            if (current >= 534) {
                current = 534;
            }
            indicater.x = current;
            move_x = end_x;
            self.resArr[_index] = indicater.x;
        }, this);
        timeline.addEventListener(egret.TouchEvent.TOUCH_END, function (e) {
            //self.resArr[_index] = indicater.x;
            //console.log(self.resArr[_index]);
        }, this);
    };
    p.handleRes = function (_text) {
        var self = this;
        var _index = this.resArr.indexOf(Math.max.apply(this, this.resArr));
        console.log(_index, this.resArr);
        var textArr = ['美食', '购物', '运动', '阅读', _text];
        var text = '';
        var textImg = '';
        var desc;
        var tmpTextIndex = Number(textArr.indexOf(textArr[_index]));
        var val = (textArr.splice(tmpTextIndex, 1))[0];
        textArr.unshift(val);
        switch (_index) {
            case 0:
                desc = this.getImage('res-eating_png');
                desc.x = 152;
                desc.y = 75;
                break;
            case 1:
                desc = this.getImage('res-shopping_png');
                desc.x = 152;
                desc.y = 75;
                break;
            case 2:
                desc = this.getImage('res-sports_png');
                desc.x = 152;
                desc.y = 75;
                break;
            case 3:
                desc = this.getImage('res-reading_png');
                desc.x = 152;
                desc.y = 75;
                break;
            case 4:
                var wrapper = new egret.Sprite;
                var wg = wrapper.graphics;
                wg.beginFill(0x000000, 0);
                wg.drawRect(0, 0, 640, 1000);
                wg.endFill();
                var top = this.getImage('res-other_png');
                top.x = 132;
                top.y = 76;
                wrapper.addChild(top);
                var bottom = new egret.TextField;
                bottom.width = 640;
                bottom.textAlign = egret.HorizontalAlign.CENTER;
                bottom.size = 58;
                bottom.y = 188;
                bottom.text = _text;
                bottom.textColor = 0xa78e59;
                wrapper.addChild(bottom);
                desc = wrapper;
                break;
            default:
                break;
        }
        var tmpy = desc.y;
        this.addChild(desc);
        egret.Tween.get(desc).to({ alpha: 0, y: desc.tmpy + 10 }).wait(600).to({ alpha: 1, y: tmpy }, 300);
        var qrcode = this.getImage('qrcode_png');
        this.setPosition(qrcode, 223, 264);
        this.addChild(qrcode);
        egret.Tween.get(qrcode).to({ alpha: 0 }).wait(600).to({ alpha: 1 }, 300);
        egret.Tween.get(this.clock).to({ scaleX: .42, scaleY: .42, x: 322, y: 684, rotation: 360 }, 1200);
        /*var more = this.getImage('more-btn_png');
        more.touchEnabled = true;
        this.setPosition(more,0,898);
        this.addChild(more);
        egret.Tween.get(more).to({alpha:0}).wait(600).to({alpha:1},300);*/
        var sortwrapper = new egret.Sprite;
        var sg = sortwrapper.graphics;
        sg.beginFill(0x000000, 0);
        sg.drawEllipse(0, 0, 271, 268);
        sg.endFill();
        sortwrapper.x = 186;
        sortwrapper.y = 554;
        this.addChild(sortwrapper);
        var bg = this.getImage('res-circle_png');
        this.setPosition(this.bg, 0, 0);
        sortwrapper.addChild(bg);
        var _mask = new egret.Sprite;
        var mg = _mask.graphics;
        mg.beginFill(0x000000);
        mg.drawEllipse(0, 0, 271, 268);
        mg.endFill();
        _mask.x = 186;
        _mask.y = 554;
        this.addChild(_mask);
        sortwrapper.mask = _mask;
        var text1 = this.createText(textArr[0], 271, 90, 0, 0, 40);
        var text2 = this.createText(textArr[1], 271, 56, 0, 90);
        var text3 = this.createText(textArr[2], 271, 40, 0, 146);
        var text4 = this.createText(textArr[3], 271, 34, 0, 186);
        var text5 = this.createText(textArr[4], 271, 45, 0, 220);
        sortwrapper.addChild(text1);
        sortwrapper.addChild(text2);
        sortwrapper.addChild(text3);
        sortwrapper.addChild(text4);
        sortwrapper.addChild(text5);
        egret.Tween.get(sortwrapper).to({ x: 457 }).wait(1200).to({ x: 186 }, 500).call(function () {
            (window['lastBtn'] || function () { })();
            if (window['version'] == 'weixin') {
                var renderTexture = new egret.RenderTexture();
                var b = renderTexture.drawToTexture(self, new egret.Rectangle(0, 0, 640, 900));
                var base = renderTexture.toDataURL('image/png', new egret.Rectangle(0, 0, 640, 900));
                window['showTips'](base);
            }
        });
    };
    p.createText = function (_str, _w, _h, _x, _y, _size) {
        if (_size === void 0) { _size = 22; }
        var tf = new egret.TextField;
        tf.text = _str;
        tf.width = _w;
        tf.height = _h;
        tf.x = _x;
        tf.y = _y;
        tf.textAlign = egret.HorizontalAlign.CENTER;
        tf.verticalAlign = egret.VerticalAlign.MIDDLE;
        tf.textColor = 0x2c2c2c;
        tf.size = _size;
        return tf;
    };
    return FirstScreen;
}(Base));
egret.registerClass(FirstScreen,'FirstScreen');
//# sourceMappingURL=FirstScreen.js.map
//=============================================================================
// S_Itemscene_kz.js
//=============================================================================

/*:ja
 * @plugindesc レイアウトの異なるアイテム画面 
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * アイテムのメモに<ill:表示する画像のファイル名>と<br:説明文>を書いて下さい。
 * ファイルは imgにdxというフォルダを作ってその中に入れて下さい。
 * 尚絵を用意していない場合エラーが出ますのでお気をつけて。
 * サンプルの絵のサイズ指定は188✗250です。
 * 以下コメントにて改変箇所を記載しておきます。★で検索下さい。
 *
 * 制作者：sairi　[Twitter＠sairi55]
 * special thanks 剣崎様
 * 無責任に行きたいので他のプラグインとの競合等により
 * バグ、エラーが発生した場合の対応、責任は取れません。
 * 改変がし易いように説明も入れたつもりですが
 * 全てご使用は自己責任でお願い致します。
 *  
 * 使用規約：
 * ジャンル無制限、改変可
 * 素材自体の販売禁止
 * ゲームに含めての再配布は可
 *  
 * クレジットの記載は強制しませんが入れてくれると嬉しいです。
 * あと教えてくれるともっと嬉しいです。
 * 以上宜しくお願いします。
 */

ImageManager.loaddx = function(filename, hue) {
    return this.loadBitmap('img/dx/', filename, hue, false);
	
}

Window_Info.prototype.loadImages = function() {
        if (this.item())
        {
            ImageManager.loaddx(this.item().meta.ill);
        }	
};


function Scene_Item() {
    this.initialize.apply(this, arguments);
}

Scene_Item.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Item.prototype.constructor = Scene_Item;

Scene_Item.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Item.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
//ヘルプウィンドウ削除、新しいウインドウ追加----------------------------------------------	
//    this.createHelpWindow();
    this.createCategoryWindow();
	this._categoryWindow.x = 0;
	this._categoryWindow.y = 0;
    this.createItemWindow();
	this.createInfoWindow();
    this.createActorWindow();
};

Scene_Item.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ItemCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = 0;
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
};


Scene_Item.prototype.createItemWindow = function() {
	//★アイテムウインドウの表示X軸
	var wx = Graphics.boxWidth/2.5;
	//★アイテムウインドウの表示Y軸
    var wy = this._categoryWindow.y + this._categoryWindow.height;
	//★アイテムウインドウの幅
	var ww = Graphics.boxWidth-Graphics.boxWidth/2.5;
	//★アイテムウインドウの高さ
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_ItemList(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
};

Scene_Item.prototype.user = function() {
    var members = $gameParty.movableMembers();
    var bestActor = members[0];
    var bestPha = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].pha > bestPha) {
            bestPha = members[i].pha;
            bestActor = members[i];
        }
    }
    return bestActor;
};

Scene_Item.prototype.onCategoryOk = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Item.prototype.onItemOk = function() {
    $gameParty.setLastItem(this.item());
    this.determineItem();
};

Scene_Item.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    this._categoryWindow.activate();
};

Scene_Item.prototype.playSeForItem = function() {
    SoundManager.playUseItem();
};

Scene_Item.prototype.useItem = function() {
    Scene_ItemBase.prototype.useItem.call(this);
    this._itemWindow.redrawCurrentItem();
};

//-------------------------------------------------------
　　//★カテゴリーウインドウに表示する種類の数（道具、貴重品等）
　　Window_ItemCategory.prototype.maxCols = function() {
  　return 1;
　　};
　　//★カテゴリーウインドウの高さ
	Window_ItemCategory.prototype.windowHeight = function() {
　　return  Graphics.boxHeight/8;　　
　　};
//-------------------------------------------------------

 var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this.createInfoWindow();
    }

    Scene_Item.prototype.createInfoWindow = function() {
        this._InfoWindow = new Window_Info();
        this.addWindow(this._InfoWindow);
    };

var _Scene_Item_update = Scene_Item.prototype.update;
    Scene_Item.prototype.update = function() {
        _Scene_Item_update.call(this);
  
        if (this.item())//アイテムが見つからなかった場合を想定
        {
           this._InfoWindow.setText(this.item().meta.br, this.item().meta.ill);
        }
    };

　　function Window_Info() {
	    this.initialize.apply(this, arguments);
	}

	Window_Info.prototype = Object.create(Window_Base.prototype);
	Window_Info.prototype.constructor = Window_Info;
	Window_Info.prototype.initialize = function() {
	//★ヘルプウィンドウ代わりのウインドウの設定
	//x＝表示位置x軸、y＝表示位置y軸、width=ウインドウ幅、height=ウインドウの高さ	
		var x = 0;
		var y = Graphics.boxHeight/8;
	    var width = Graphics.boxWidth/2.5;
	    var height = Graphics.boxHeight-Graphics.boxHeight/8;
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
	};

 Window_Info.prototype.setText = function(str, ill) {
  this._text = str;
                this._ill = ill;
  this.refresh();
 };
	
// ウィンドウに載せる内容
 Window_Info.prototype.refresh = function() {
            x = this.x;
            y = this.y;
     this.contents.clear();
            x = 0;
//★絵の直下に文字を置くようにしているので250の部分を絵の高さサイズに変更して下さい。			
            y = 300+this.textPadding() * 2;
    this.drawPicture();
        this.drawTextEx(this._text, x, y);//エスケープ文字使用可能
        };


		
 Window_Info.prototype.drawPicture = function(w, h, dx, dy) {
 var bitmapName;
         if (this._ill){
             bitmapName = this._ill; 
         }       
       var bitmap = bitmapName ? ImageManager.loaddx(bitmapName) : null;
	   
	   
//左から0,0,には触らずに、
//188が絵の幅、250は絵の高さ、60は表示位置x、その後の0は表示位置yです。	   
    this.contents.blt(bitmap, 0, 0, 280, 300, 5, 20);
  
}  		
			
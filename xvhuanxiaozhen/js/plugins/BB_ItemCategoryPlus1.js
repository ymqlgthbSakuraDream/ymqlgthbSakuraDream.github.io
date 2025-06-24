//=============================================================================
// BB_ItemCategoryPlus1.js
// Copyright (c) 2016 BB ENTERTAINMENT
//=============================================================================

/*:
 * @plugindesc アイテムカテゴリに"アビリティ"を追加するプラグイン
 * @author ビービー
 * 
 * 
 * @help プラグインの説明
 * トリアコンタンさの作成されたプラグイン"AddSubCategoryWeapon.js"を
 * 同時に使う場合はこのプラグインの下になるように配置してください。
 * 
 * 利用規約：
 * このプラグインは、MITライセンスのもとで公開されています。
 * Copyright (c) 2016 BB ENTERTAINMENT
 * Released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * 
 * コンタクト：
 * BB ENTERTAINMENT Twitter: https://twitter.com/BB_ENTER/
 * BB ENTERTAINMENT BLOG   : http://bb-entertainment-blog.blogspot.jp/
 */


(function() {

//-----------------------------------------------------------------------------
// プラグインパラメータ管理
var parameters = PluginManager.parameters('BB_ItemCategoryPlus1');

//-----------------------------------------------------------------------------
// アイテムリストに表示するカテゴリの数
var _Window_ItemCategory_prototype_maxCols = Window_ItemCategory.prototype.maxCols;
Window_ItemCategory.prototype.maxCols = function() {
    return 2;
};

//-----------------------------------------------------------------------------
// アイテムリストに表示する名前
var _Window_ItemCategory_prototype_makeCommandList = Window_ItemCategory.prototype.makeCommandList;
Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');

    this.addCommand(TextManager.keyItem, 'keyItem');
};

//-----------------------------------------------------------------------------
// カテゴリの中に表示するアイテムのID
var _Window_ItemList_prototype_includes = Window_ItemList.prototype.includes;
Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
    case 'item':
        return DataManager.isItem(item) && item.itypeId === 1;
    case 'weapon':
        return DataManager.isWeapon(item);
    case 'armor':
        return DataManager.isArmor(item) && item.etypeId >= 3 && item.etypeId <= 4;
    case 'ability':
        return DataManager.isArmor(item) && item.etypeId === 5;
    case 'keyItem':
        return DataManager.isItem(item) && item.itypeId === 2;
    default:
        return false;
    }
};

})();
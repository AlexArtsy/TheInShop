"use strict";
//import * as render from './render.js';


// ============= залогинивание юзера ================================================================================================
function userWantsToLogIn(login, pass) // вызывается кликом по кнопке "зайти" из функции showLoginWindow
{
	//alert('проверка: пользователь нажал кнопку зайти');
	if (checkUserLoginInDB(login))
	{
		if(checkUserPassword(login,pass)) 
		{
			localStorage.setItem('loginnedUser',login); // сохраняем логин текущего пользователя 
			localStorage.setItem('logOn',true); // устанавливаем статус аккаунта (залогинен)
			userIsLogginned();
		}
		else
		{userNoLoginned();}
	}
	else
	{
		alert('Проверьте логин!');
	}
	
}
function checkUserLoginInDB(login) // проверка наличия логина в базе (localStorage), вызывается из userWantsToLogIn
{	
	//alert('проверка: проверяем логин в базе');
	var checkUserLogin = localStorage.getItem(login);
	if(checkUserLogin != null)
	{ 
		return true;
	}
	else{return false;}
}
function checkUserPassword(login,pass) // проверка пароля при залогинивании, вызывается из userWantsToLogIn
{	
	//alert('проверка: проверяем правильность пароля');
	//var checkPass = localStorage.getItem(login);
	// var returnObj = JSON.parse(localStorage.getItem('key'))
	var returnUserData = JSON.parse(localStorage.getItem(login)); 
	if(returnUserData.pass == pass)
	{ 
		alert('Приветствуем Вас в Цехе!');
		return true;		
	}
	else{alert('пароль не правильный!'); return false; } 
}
function userWantsToLogOut()
{
	localStorage.setItem('logOn',false);
	localStorage.setItem('loginnedUser',null);
	userNoLoginned();
}
// ============= Регистрация юзера ================================================================================================================================
function userWantsToReg(login,pass)
{
	if(checkUserLoginInDB(login))
	{
		alert('Такой логин существует!');
	}
	else
	{
		savwNewUserID(login); // увеличиваем счетчик новых пользователей
		saveNewUserInDB(login,pass);
		userWantsToLogIn(login,pass);
	}
}
function saveNewUserInDB(login,password,i) // сохранение нового пользователя в базу (localStorage) 
{
	var userDataToDB = {
		name: login,
		id: localStorage.getItem('userCount'), // присваиваем юзеру порядковый номер 
		pass: password, // пароль
		gen: '-', // пол
		frNum: 0, // число друзей
		frArr: new Array(), // список id добавленных друзей 
		incoFrRecArr: new Array(), // массив входящих запросов на добавление в друзья 
		outgFrRecArr: new Array(), // массив исходящих запросов на добавление в друзья
		st: '-', //должность в цехе
		mess: {     // массив обьектов содержащих массив сообщений
			incom: new Array(),
			outg: new Array(),
		},
	};
	var userDataConvertToString = JSON.stringify(userDataToDB);
	//alert('проверка'+userDataConvertToString);
	localStorage.setItem(login,userDataConvertToString); //записали в localStorage инфу юзера по ключу его логина
}
function savwNewUserID(login) // инкрементирует счетчик зарегистрированнх пользователей, ключ - userCount
{	
	var cnt;
	if(localStorage.getItem('userCount')== null)
	{
		localStorage.setItem('userCount',1);
		localStorage.setItem(1,login);
		alert('запись первого юзера');
	}
	else
	{
		cnt = localStorage.getItem('userCount'); // получаем число уже зареганных пользователей
		cnt++; 
		localStorage.setItem('userCount',cnt); // записываем новое число пользователей
		localStorage.setItem(cnt,login);
	} 
	
}

// ============ Button events ===============================================================================================
function showOutButton(showOrNot)
{	outButton.innerHTML="";
	if(showOrNot==true)
	{	
		document.getElementById("footer").append(outButton);
		outButton.insertAdjacentHTML('afterbegin','<div><button onclick="userWantsToLogOut();" >Выйти из Цеха</button></div>');
	}
	else{outButton.remove();}
}
function showRegistrationButton(showOrNot)
{	registrationButton.innerHTML="";
	if(showOrNot==true)
	{	
		document.getElementById("loginDiv").append(registrationButton);
		registrationButton.insertAdjacentHTML('afterbegin','<div><button style="float: right;" onclick="showRegistrationWindow(true);" >Зарегистрироваться</button></div>');
	}
	else{registrationButton.remove(); }
}
function addFriend(id, func)
{	
	var frListLength = userObjData.frArr.length;
	userObjData.frArr[frListLength] = id;
	for(let i = 0; i <= userObjData.incoFrRecArr.length; i++ ){
		if(userObjData.incoFrRecArr[i]== id){
			userObjData.incoFrRecArr.splice(i,1);
		}
	}
	userObjData.frNum = userObjData.frArr.length;
	// удаляем друга из массива исходящих заявок
	for(let i = 0; i <= userObjData.outgFrRecArr.length; i++ ){
		if(userObjData.outgFrRecArr[i]== id){
			userObjData.outgFrRecArr.splice(i,1);
		}
	}
	
	saveNewUserData(userObjData);
	
	let friendUserData = getFriendsDataFromString(id);
	for(let i = 0; i <= friendUserData.outgFrRecArr.length; i++ ){
		if(friendUserData.outgFrRecArr[i]== id){
			friendUserData.outgFrRecArr.splice(i,1);
		}
	}
	saveNewFriendsData(friendUserData,id);
	func(true);
	
}
function deletFriend(id,func)
{	
	for(let i = 0; i <= userObjData.frArr.length; i++ ){
		if(userObjData.frArr[i]== id){
			userObjData.frArr.splice(i,1);
		}
	}
	userObjData.frNum = userObjData.frArr.length;
	saveNewUserData(userObjData);
	let friendUserData = getFriendsDataFromString(id);
	friendUserData.frNum--;
	for(let i = 0; i <= friendUserData.frArr.length; i++ ){
		if(friendUserData.frArr[i]== userObjData.id){
			friendUserData.frArr.splice(i,1);
		}
	}
	saveNewFriendsData(friendUserData,id);
	func(true);
}
function rejectFriend(id,func)
{
	for(let i = 0; i <= userObjData.incoFrRecArr.length; i++ ){
		if(userObjData.incoFrRecArr[i]== id){
			userObjData.incoFrRecArr.splice(i,1);
		}
	}
	saveNewUserData(userObjData);
	
	let friendUserData = getFriendsDataFromString(id);
	for(let i = 0; i <= friendUserData.outgFrRecArr.length; i++ ){
		if(friendUserData.outgFrRecArr[i]== id){
			friendUserData.outgFrRecArr.splice(i,1);
		}
	}
	saveNewFriendsData(friendUserData,id);
	func(true);
}
function rejectRequestToFriend(id,func)
{
	for(let i = 0; i <= userObjData.outgFrRecArr.length; i++ ){
		if(userObjData.outgFrRecArr[i]== id){
			userObjData.outgFrRecArr.splice(i,1);
		}
	}
	saveNewUserData(userObjData);
	
	let friendUserData = getFriendsDataFromString(id);
	for(let i = 0; i <= friendUserData.incoFrRecArr.length; i++ ){
		if(friendUserData.incoFrRecArr[i]== id){
			friendUserData.incoFrRecArr.splice(i,1);
		}
	}
	saveNewFriendsData(friendUserData,id);
	func(true);
}
// ===========================================================================================================================

// =======================================================================================================================
function itsYou(id){
	if(userObjData.id==id)
	{
		return (true);
	}
	else {return (false);}
}
function isUserInincoFrRecArr(id){
	for( let j = 0; j<= userObjData.incoFrRecArr.length; j++){
		if(userObjData.incoFrRecArr[j]== id){
			return true; 
		}
	}
	return false;
}
function isUserInOutgFrRecArr(id){
	for( let j = 0; j<= userObjData.outgFrRecArr.length; j++){
		if(userObjData.outgFrRecArr[j]== id){
			return true; 
		}
	}
	return false;
}
function isUserInFrArr(id){
	for( let j = 0; j<= userObjData.frArr.length; j++){
		if(userObjData.frArr[j]== id){
			return true; 
		}
	}
	return false;
}


function getUserDataFromString() // получаем данные пользователя из строки по ключу логина
{
	var login = localStorage.getItem('loginnedUser');
	var userData = JSON.parse(localStorage.getItem(login));
	return (userData); // возвращаем объект
}

function saveNewUserData(obj) // сохраняем данные пользователя 
{
	var userStringData = JSON.stringify(obj);
	localStorage.setItem(localStorage.getItem('loginnedUser'),userStringData);
}
function getFriendsDataFromString(id) // получаем данные друга из строки по ключу логина
{
	var login = localStorage.getItem(id);
	var userData = JSON.parse(localStorage.getItem(login));
	return (userData); // возвращаем объект
}
function saveNewFriendsData(obj,id) // сохраняем данные пользователя 
{
	var userStringData = JSON.stringify(obj);
	localStorage.setItem(localStorage.getItem(id),userStringData);
}
function userWantsToAddFriend(id,funct)
{
	// сохраняем исходящие запросы на добавление  друзья
	
	var outgFrRecArrLength = userObjData.outgFrRecArr.length;
	userObjData.outgFrRecArr[outgFrRecArrLength]=id; // запоминаем, кому пользователь отправил запрос на добавление
	saveNewUserData(userObjData);
	
	// отправляем запрос
	var friendsUserData = getFriendsDataFromString(id);
	var incoFrRecArrLength = friendsUserData.incoFrRecArr.length;
	friendsUserData.incoFrRecArr[incoFrRecArrLength]= userObjData.id; // записали в массив входящих заявок будущего друга id отправителя
	saveNewFriendsData(friendsUserData,id);
	alert('Заявка отправлена');
	funct(true);
}
function userWantToEditData(gen,st){
	userObjData.gen = gen ; 
	userObjData.st = st ; 
	saveNewUserData(userObjData);
	
	showUserInfoWindow(true);
}
// =========== контент ЦЕНТРальной части =================================================================================
function showUserInfoWindow(showOrNot)
{	userInfoWindow.innerHTML="";
	if(showOrNot==true)
	{	centerWindow.innerHTML="";
		document.getElementById("centerWindow").append(userInfoWindow);
		
		userInfoWindow.insertAdjacentHTML('afterbegin','<button onclick="showUserInfoEditWindow(true)" >Редактировать</button></br>');
		userInfoWindow.insertAdjacentHTML('afterbegin','<div>Должность в цехе: '+userObjData.st+'</div>');
		userInfoWindow.insertAdjacentHTML('afterbegin','<div>Количество друзей: '+userObjData.frNum+'</div>');
		userInfoWindow.insertAdjacentHTML('afterbegin','<div> Пол: '+userObjData.gen+'</div>');
		userInfoWindow.insertAdjacentHTML('afterbegin','<h2>'+userObjData.name+'</h2>');
	}
	else{userInfoWindow.remove(); }
}
function showUserInfoEditWindow(showOrNot)
{	
userInfoEditWindow.innerHTML="";
	if(showOrNot==true)
	{	centerWindow.innerHTML="";
		document.getElementById("centerWindow").append(userInfoEditWindow);
		
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<button onclick="userWantToEditData(editGen.value,editSt.value)" >Сохранить</button></br>');
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<div>Должность в цехе: '+userObjData.st+'</div><input type ="text" style="width: 200px; height: 20px;" id="editSt" placeholder=""></input> ');
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<div>Количество друзей: '+userObjData.frNum+'</div> ');
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<div> Пол: '+userObjData.gen+'</div><input type ="text" style="width: 200px; height: 20px;" id="editGen" placeholder=""></input>');
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<h2>'+userObjData.name+'</h2>');
	}
	else{userInfoEditWindow.remove(); }
}
function showFriendsRequestWindow(showOrNot)
{	friendsRequestWindow.innerHTML="";
	
	if(showOrNot==true)
	{	
		centerWindow.innerHTML="";
		document.getElementById("centerWindow").prepend(friendsRequestWindow);
		var userData = getUserDataFromString();
		friendsRequestWindow.insertAdjacentHTML('afterbegin','<h2> Заявки в друзья</h2>');
		for(let i=0;i<userData.incoFrRecArr.length; i++)
		{
			//alert('проверка i '+i+' проверка ид '+userData.incoFrRecArr[i]);
			var friendsLogin = localStorage.getItem(userData.incoFrRecArr[i]); // localStorage.getItem('userCount'),
			let htmlObj = 'frReqDiv'+i;
			friendsRequestWindow.insertAdjacentHTML('beforeend','<div id="'+htmlObj+'">'+friendsLogin+'<button onclick="addFriend('+userData.incoFrRecArr[i]+',showFriendsRequestWindow)" >добавить</button><button onclick="rejectFriend('+userData.incoFrRecArr[i]+',showFriendsRequestWindow)" >отклонить</button></div>');
		}
		
		
	}
	else{friendsRequestWindow.remove(); }
}
function showUserList(showOrNot)
{
	userListWindow.innerHTML="";
	if(showOrNot==true)
	{	//myElm.render('<div>Тут что-от есть!!!</div>');
		
		centerWindow.innerHTML="";
		document.getElementById("centerWindow").prepend(userListWindow);
		userListWindow.innerHTML='<h2>Список всех пользователей</h2>';
		for(let i=1;i<= localStorage.getItem('userCount');i++)
		{
			userListWindow.insertAdjacentHTML('beforeend','<div id="fr'+i+'">'+showPlusButton(i)+localStorage.getItem(i)+isYou(i)+showAddOrNotButton(i)+showRequestInfo(i)+'</div>');
		}
	
	}
	else{userListWindow.remove(); }
	function isYou(id){
		if(itsYou(id))
		{
			return (' (это Вы)');
		}
		else {
		 return(' ');
		 }
	}
	function showRequestInfo(i){ //isUserInOutgFrRecArr
		if(isUserInOutgFrRecArr(i))
		{
			return (' (Заявка отправлена)');
		}
		else {
		 return(' ');
		 }
	}
	function showPlusButton(idFr){
		let thisHTMLObjId = 'plusBt'+idFr;
		if( itsYou(idFr) || isUserInincoFrRecArr(idFr) || isUserInFrArr(idFr) || isUserInOutgFrRecArr(idFr)){
			return(' <span style="margin-left: 25px;"></span> ');
		}
		else{
			return ('<button id="'+thisHTMLObjId+'" onclick="userWantsToAddFriend('+idFr+',showUserList)">+</button>');
		}
	}
	function showAddOrNotButton(id){
		if(isUserInincoFrRecArr(id)){
			let thisHTMLObjId = 'addButton'+id;
			return(`<div id="`+thisHTMLObjId+`"><button onclick="addFriend(`+id+`,`+thisHTMLObjId+`)" >добавить</button>
			<button onclick="rejectFriend(`+id+`,`+thisHTMLObjId+`)" >отклонить</button></div>`);
		}
		else{
			return (' ');
		}
	}
}
function showUserFriendsList(showOrNot)
{	
	if(showOrNot==true)
	{	centerWindow.innerHTML="";
		userFriendsListWindow.innerHTML="";
		document.getElementById("centerWindow").prepend(userFriendsListWindow);
		userFriendsListWindow.id="userFriendsListWin";
		let friend;
		userFriendsListWindow.innerHTML='<h2>Список друзей: </h2>';
		for(let i=0;i< userObjData.frArr.length;i++)
		{		
			friend = localStorage.getItem(userObjData.frArr[i]);
			userFriendsListWindow.insertAdjacentHTML('beforeend','<div>'+friend+'<button onclick="deletFriend('+userObjData.frArr[i]+',showUserFriendsList)" >удалить</button></div>');
		}
	
	}
	else{userFriendsListWindow.remove(); }
}
function showOutgoingRequestToFriendList(showOrNot)
{	
	if(showOrNot==true)
	{	centerWindow.innerHTML="";
		outgoingRequestToFriendsWindow.innerHTML="";
		
		document.getElementById("centerWindow").prepend(outgoingRequestToFriendsWindow);
		let friend;
		outgoingRequestToFriendsWindow.innerHTML='<h2>Исходщие заявки: </h2>';
		
		for(let i=0;i< userObjData.outgFrRecArr.length;i++)
		{		
			friend = localStorage.getItem(userObjData.outgFrRecArr[i]);
			outgoingRequestToFriendsWindow.insertAdjacentHTML('beforeend','<div>'+friend+'<button onclick="rejectRequestToFriend('+userObjData.outgFrRecArr[i]+',showOutgoingRequestToFriendList)" >отменить</button></div>');
		}
	
	}
	else{outgoingRequestToFriendsWindow.remove(); }
}
// =====   left sidebar ===========================================================================
function showUserSideBarWindow(showOrNot)
{
	userSideBarWindow.innerHTML="";
	if(showOrNot==true)
	{	leftSideBarWindow.innerHTML="";
		document.getElementById("leftSideBarWindow").prepend(userSideBarWindow);
		userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showUserInfoWindow(true)" >Инфо пользователя</button></br>');
		userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showUserFriendsList(true)" >Мои друзья</button></br>');
		userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showUserList(true)" >Найти друга</button></br>');
		userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showOutgoingRequestToFriendList(true)" >Исходящие заявки</button></br>');
		if (userObjData.incoFrRecArr.length != 0)
		{	
			userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showFriendsRequestWindow(true);" >Заявки в друзья</button>');
		}
	}
	else
	{  
		userSideBarWindow.remove();
	}
}

function showLoginWindow(showOrNot)
{
	loginWindow.innerHTML="";
	if(showOrNot==true)
	{	
		document.getElementById("content").append(loginWindow);
		loginWindow.insertAdjacentHTML('afterbegin','<div id="loginDiv"><h2>Зайти в учетную запись</h2><input type ="text" style="width: 200px; height: 20px;" id="loginCheck" placeholder="введите логин"></input></br><input type ="text" style="width: 200px; height: 20px;" id="passCheck" placeholder="введите пароль"></input></br><button onclick="userWantsToLogIn(loginCheck.value, passCheck.value);" >Зайти</button></div>');
	}
	else
	{  
		loginWindow.remove();
	}
}
function showRegistrationWindow(showOrNot)
{
	registrationWindow.innerHTML="";
	if(showOrNot==true)
	{	
		document.getElementById("loginDiv").replaceWith(registrationWindow);
		registrationWindow.insertAdjacentHTML('afterbegin','<div id="regDiv"><h2>Создайте учетную запись</h2><input type ="text" style="width: 200px; height: 20px;" id="loginCheck" placeholder="введите логин"></input></br><input type ="text" style="width: 200px; height: 20px;" id="passCheck" placeholder="введите пароль"></input></br><button onclick="userWantsToReg(loginCheck.value, passCheck.value);" >Зарегистрировать</button></br><button onclick="userNoLoginned();" >У меня уже есть аккаунт</button></div>');
	}
	else
	{  
		registrationWindow.remove();
	}
}

function MyComponentHTML(id, type){
	this.id = id;
	this.type = type;
	this.elm = document.createElement(type); 
	
	this.render = function (htmlText){
		this.innerHTML = "";
		//alert('отображаем компонент');
		
		this.elm.id = id;
		document.getElementById("content").append(this.elm);
		this.elm.insertAdjacentHTML('afterbegin',htmlText);
	}
	this.hide = function (){
		this.elm.remove();
		//alert('скрыть компонент');
	}

}
// ================================================================================================
function userIsLogginned() // отрисока контента если юзер залогинен
{
	document.getElementById("nasUzheP").innerHTML = "В цехе сидит: " + localStorage.getItem('userCount') +" человек";
	userObjData = getUserDataFromString();
	document.getElementById("content").prepend(rightSideBarWindow);
	document.getElementById("content").prepend(centerWindow);
	document.getElementById("content").prepend(leftSideBarWindow);
	const userNameInHeder = document.createElement('div');  
	userNameInHeder.innerHTML='<div style="float: right;">'+ userObjData.name +'</div>';
	//document.getElementById("logo").append(userNameInHeder);
	//document.getElementById("centerWindow").append(userInfoWindow);
	
	showLoginWindow(false);
	showRegistrationButton(false);
	showRegistrationWindow(false);
	showUserSideBarWindow(true);
	showUserInfoWindow(true);
	showOutButton(true);
	showUserList(false);
	//showUserFriendsList(true);
	
}
function userNoLoginned() // отрисовка контента, если пользователь не залогинен
{
	document.getElementById("nasUzheP").innerHTML = "В цехе сидит: " + localStorage.getItem('userCount') +" человек";
	rightSideBarWindow.remove();
	centerWindow.remove();
	leftSideBarWindow.remove();
	showUserInfoWindow(false);
	showOutButton(false);
	showUserList(false);
	showRegistrationWindow(false);
	//showUserFriendsList(false);
	showUserSideBarWindow(false);
	showLoginWindow(true);
	showRegistrationButton(true);
}
//====================================================================================
/* 
	Список ключей:
	userCount - счетчик пользователей он же ID пользователя
	*login* - логины пользователей, к ним привязывается вся информация о пользователе
	loginnedUser - содержит логин залогиненного в данный момент пользователя
	logOn - содержит состояние аккаунта: true - пользователь залогинен, false - никто не залогинен
	
	
*/


// объявление html - элементов для последующей динамической вставки и удаления
let userObjData; // записываем при загрузке страницы данные пользователя
var loginWindow = document.createElement('div');  loginWindow.id="loginWindow";
var outButton = document.createElement('div'); outButton.id="outButton";
var userInfoWindow = document.createElement('div'); userInfoWindow.id = "userInfoWindow";
var registrationButton = document.createElement('div');
var registrationWindow = document.createElement('div');
var userListWindow = document.createElement('div'); // общий список пользователей 
var userFriendsListWindow = document.createElement('div'); 
var userSideBarWindow = document.createElement('div'); userSideBarWindow.id = "userSideBarWindow";
var centerWindow = document.createElement('div'); centerWindow.id = "centerWindow";
var rightSideBarWindow = document.createElement('div'); rightSideBarWindow.id = "rightSideBarWindow";
var leftSideBarWindow = document.createElement('div'); leftSideBarWindow.id = "leftSideBarWindow";
var friendsRequestWindow = document.createElement('div'); friendsRequestWindow.id = "friendsRequestWindow"; 
var outgoingRequestToFriendsWindow = document.createElement('div'); outgoingRequestToFriendsWindow.id = "outgoingRequestToFriendsWindow"; 
var userInfoEditWindow = document.createElement('div'); userInfoEditWindow.id = "userInfoEditWindow"; 

// стартовая логика
if(localStorage.getItem('logOn')== 'true')
{
	userIsLogginned();
}
else
{
    	/* for(let i=0; i<30;i++){
		saveNewUserInDB(localStorage.getItem(i),'123',i);
	}      */
	userNoLoginned(true);
}

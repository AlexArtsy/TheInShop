"use strict";
//import * as render from './render.js';


// ============= ������������� ����� ================================================================================================
function userWantsToLogIn(login, pass) // ���������� ������ �� ������ "�����" �� ������� showLoginWindow
{
	//alert('��������: ������������ ����� ������ �����');
	if (checkUserLoginInDB(login))
	{
		if(checkUserPassword(login,pass)) 
		{
			localStorage.setItem('loginnedUser',login); // ��������� ����� �������� ������������ 
			localStorage.setItem('logOn',true); // ������������� ������ �������� (���������)
			userIsLogginned();
		}
		else
		{userNoLoginned();}
	}
	else
	{
		alert('��������� �����!');
	}
	
}
function checkUserLoginInDB(login) // �������� ������� ������ � ���� (localStorage), ���������� �� userWantsToLogIn
{	
	//alert('��������: ��������� ����� � ����');
	var checkUserLogin = localStorage.getItem(login);
	if(checkUserLogin != null)
	{ 
		return true;
	}
	else{return false;}
}
function checkUserPassword(login,pass) // �������� ������ ��� �������������, ���������� �� userWantsToLogIn
{	
	//alert('��������: ��������� ������������ ������');
	//var checkPass = localStorage.getItem(login);
	// var returnObj = JSON.parse(localStorage.getItem('key'))
	var returnUserData = JSON.parse(localStorage.getItem(login)); 
	if(returnUserData.pass == pass)
	{ 
		alert('������������ ��� � ����!');
		return true;		
	}
	else{alert('������ �� ����������!'); return false; } 
}
function userWantsToLogOut()
{
	localStorage.setItem('logOn',false);
	localStorage.setItem('loginnedUser',null);
	userNoLoginned();
}
// ============= ����������� ����� ================================================================================================================================
function userWantsToReg(login,pass)
{
	if(checkUserLoginInDB(login))
	{
		alert('����� ����� ����������!');
	}
	else
	{
		savwNewUserID(login); // ����������� ������� ����� �������������
		saveNewUserInDB(login,pass);
		userWantsToLogIn(login,pass);
	}
}
function saveNewUserInDB(login,password,i) // ���������� ������ ������������ � ���� (localStorage) 
{
	var userDataToDB = {
		name: login,
		id: localStorage.getItem('userCount'), // ����������� ����� ���������� ����� 
		pass: password, // ������
		gen: '-', // ���
		frNum: 0, // ����� ������
		frArr: new Array(), // ������ id ����������� ������ 
		incoFrRecArr: new Array(), // ������ �������� �������� �� ���������� � ������ 
		outgFrRecArr: new Array(), // ������ ��������� �������� �� ���������� � ������
		st: '-', //��������� � ����
		mess: {     // ������ �������� ���������� ������ ���������
			incom: new Array(),
			outg: new Array(),
		},
	};
	var userDataConvertToString = JSON.stringify(userDataToDB);
	//alert('��������'+userDataConvertToString);
	localStorage.setItem(login,userDataConvertToString); //�������� � localStorage ���� ����� �� ����� ��� ������
}
function savwNewUserID(login) // �������������� ������� ����������������� �������������, ���� - userCount
{	
	var cnt;
	if(localStorage.getItem('userCount')== null)
	{
		localStorage.setItem('userCount',1);
		localStorage.setItem(1,login);
		alert('������ ������� �����');
	}
	else
	{
		cnt = localStorage.getItem('userCount'); // �������� ����� ��� ���������� �������������
		cnt++; 
		localStorage.setItem('userCount',cnt); // ���������� ����� ����� �������������
		localStorage.setItem(cnt,login);
	} 
	
}

// ============ Button events ===============================================================================================
function showOutButton(showOrNot)
{	outButton.innerHTML="";
	if(showOrNot==true)
	{	
		document.getElementById("footer").append(outButton);
		outButton.insertAdjacentHTML('afterbegin','<div><button onclick="userWantsToLogOut();" >����� �� ����</button></div>');
	}
	else{outButton.remove();}
}
function showRegistrationButton(showOrNot)
{	registrationButton.innerHTML="";
	if(showOrNot==true)
	{	
		document.getElementById("loginDiv").append(registrationButton);
		registrationButton.insertAdjacentHTML('afterbegin','<div><button style="float: right;" onclick="showRegistrationWindow(true);" >������������������</button></div>');
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
	// ������� ����� �� ������� ��������� ������
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


function getUserDataFromString() // �������� ������ ������������ �� ������ �� ����� ������
{
	var login = localStorage.getItem('loginnedUser');
	var userData = JSON.parse(localStorage.getItem(login));
	return (userData); // ���������� ������
}

function saveNewUserData(obj) // ��������� ������ ������������ 
{
	var userStringData = JSON.stringify(obj);
	localStorage.setItem(localStorage.getItem('loginnedUser'),userStringData);
}
function getFriendsDataFromString(id) // �������� ������ ����� �� ������ �� ����� ������
{
	var login = localStorage.getItem(id);
	var userData = JSON.parse(localStorage.getItem(login));
	return (userData); // ���������� ������
}
function saveNewFriendsData(obj,id) // ��������� ������ ������������ 
{
	var userStringData = JSON.stringify(obj);
	localStorage.setItem(localStorage.getItem(id),userStringData);
}
function userWantsToAddFriend(id,funct)
{
	// ��������� ��������� ������� �� ����������  ������
	
	var outgFrRecArrLength = userObjData.outgFrRecArr.length;
	userObjData.outgFrRecArr[outgFrRecArrLength]=id; // ����������, ���� ������������ �������� ������ �� ����������
	saveNewUserData(userObjData);
	
	// ���������� ������
	var friendsUserData = getFriendsDataFromString(id);
	var incoFrRecArrLength = friendsUserData.incoFrRecArr.length;
	friendsUserData.incoFrRecArr[incoFrRecArrLength]= userObjData.id; // �������� � ������ �������� ������ �������� ����� id �����������
	saveNewFriendsData(friendsUserData,id);
	alert('������ ����������');
	funct(true);
}
function userWantToEditData(gen,st){
	userObjData.gen = gen ; 
	userObjData.st = st ; 
	saveNewUserData(userObjData);
	
	showUserInfoWindow(true);
}
// =========== ������� ����������� ����� =================================================================================
function showUserInfoWindow(showOrNot)
{	userInfoWindow.innerHTML="";
	if(showOrNot==true)
	{	centerWindow.innerHTML="";
		document.getElementById("centerWindow").append(userInfoWindow);
		
		userInfoWindow.insertAdjacentHTML('afterbegin','<button onclick="showUserInfoEditWindow(true)" >�������������</button></br>');
		userInfoWindow.insertAdjacentHTML('afterbegin','<div>��������� � ����: '+userObjData.st+'</div>');
		userInfoWindow.insertAdjacentHTML('afterbegin','<div>���������� ������: '+userObjData.frNum+'</div>');
		userInfoWindow.insertAdjacentHTML('afterbegin','<div> ���: '+userObjData.gen+'</div>');
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
		
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<button onclick="userWantToEditData(editGen.value,editSt.value)" >���������</button></br>');
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<div>��������� � ����: '+userObjData.st+'</div><input type ="text" style="width: 200px; height: 20px;" id="editSt" placeholder=""></input> ');
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<div>���������� ������: '+userObjData.frNum+'</div> ');
		userInfoEditWindow.insertAdjacentHTML('afterbegin','<div> ���: '+userObjData.gen+'</div><input type ="text" style="width: 200px; height: 20px;" id="editGen" placeholder=""></input>');
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
		friendsRequestWindow.insertAdjacentHTML('afterbegin','<h2> ������ � ������</h2>');
		for(let i=0;i<userData.incoFrRecArr.length; i++)
		{
			//alert('�������� i '+i+' �������� �� '+userData.incoFrRecArr[i]);
			var friendsLogin = localStorage.getItem(userData.incoFrRecArr[i]); // localStorage.getItem('userCount'),
			let htmlObj = 'frReqDiv'+i;
			friendsRequestWindow.insertAdjacentHTML('beforeend','<div id="'+htmlObj+'">'+friendsLogin+'<button onclick="addFriend('+userData.incoFrRecArr[i]+',showFriendsRequestWindow)" >��������</button><button onclick="rejectFriend('+userData.incoFrRecArr[i]+',showFriendsRequestWindow)" >���������</button></div>');
		}
		
		
	}
	else{friendsRequestWindow.remove(); }
}
function showUserList(showOrNot)
{
	userListWindow.innerHTML="";
	if(showOrNot==true)
	{	//myElm.render('<div>��� ���-�� ����!!!</div>');
		
		centerWindow.innerHTML="";
		document.getElementById("centerWindow").prepend(userListWindow);
		userListWindow.innerHTML='<h2>������ ���� �������������</h2>';
		for(let i=1;i<= localStorage.getItem('userCount');i++)
		{
			userListWindow.insertAdjacentHTML('beforeend','<div id="fr'+i+'">'+showPlusButton(i)+localStorage.getItem(i)+isYou(i)+showAddOrNotButton(i)+showRequestInfo(i)+'</div>');
		}
	
	}
	else{userListWindow.remove(); }
	function isYou(id){
		if(itsYou(id))
		{
			return (' (��� ��)');
		}
		else {
		 return(' ');
		 }
	}
	function showRequestInfo(i){ //isUserInOutgFrRecArr
		if(isUserInOutgFrRecArr(i))
		{
			return (' (������ ����������)');
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
			return(`<div id="`+thisHTMLObjId+`"><button onclick="addFriend(`+id+`,`+thisHTMLObjId+`)" >��������</button>
			<button onclick="rejectFriend(`+id+`,`+thisHTMLObjId+`)" >���������</button></div>`);
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
		userFriendsListWindow.innerHTML='<h2>������ ������: </h2>';
		for(let i=0;i< userObjData.frArr.length;i++)
		{		
			friend = localStorage.getItem(userObjData.frArr[i]);
			userFriendsListWindow.insertAdjacentHTML('beforeend','<div>'+friend+'<button onclick="deletFriend('+userObjData.frArr[i]+',showUserFriendsList)" >�������</button></div>');
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
		outgoingRequestToFriendsWindow.innerHTML='<h2>�������� ������: </h2>';
		
		for(let i=0;i< userObjData.outgFrRecArr.length;i++)
		{		
			friend = localStorage.getItem(userObjData.outgFrRecArr[i]);
			outgoingRequestToFriendsWindow.insertAdjacentHTML('beforeend','<div>'+friend+'<button onclick="rejectRequestToFriend('+userObjData.outgFrRecArr[i]+',showOutgoingRequestToFriendList)" >��������</button></div>');
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
		userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showUserInfoWindow(true)" >���� ������������</button></br>');
		userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showUserFriendsList(true)" >��� ������</button></br>');
		userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showUserList(true)" >����� �����</button></br>');
		userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showOutgoingRequestToFriendList(true)" >��������� ������</button></br>');
		if (userObjData.incoFrRecArr.length != 0)
		{	
			userSideBarWindow.insertAdjacentHTML('afterbegin','<button onclick="showFriendsRequestWindow(true);" >������ � ������</button>');
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
		loginWindow.insertAdjacentHTML('afterbegin','<div id="loginDiv"><h2>����� � ������� ������</h2><input type ="text" style="width: 200px; height: 20px;" id="loginCheck" placeholder="������� �����"></input></br><input type ="text" style="width: 200px; height: 20px;" id="passCheck" placeholder="������� ������"></input></br><button onclick="userWantsToLogIn(loginCheck.value, passCheck.value);" >�����</button></div>');
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
		registrationWindow.insertAdjacentHTML('afterbegin','<div id="regDiv"><h2>�������� ������� ������</h2><input type ="text" style="width: 200px; height: 20px;" id="loginCheck" placeholder="������� �����"></input></br><input type ="text" style="width: 200px; height: 20px;" id="passCheck" placeholder="������� ������"></input></br><button onclick="userWantsToReg(loginCheck.value, passCheck.value);" >����������������</button></br><button onclick="userNoLoginned();" >� ���� ��� ���� �������</button></div>');
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
		//alert('���������� ���������');
		
		this.elm.id = id;
		document.getElementById("content").append(this.elm);
		this.elm.insertAdjacentHTML('afterbegin',htmlText);
	}
	this.hide = function (){
		this.elm.remove();
		//alert('������ ���������');
	}

}
// ================================================================================================
function userIsLogginned() // �������� �������� ���� ���� ���������
{
	document.getElementById("nasUzheP").innerHTML = "� ���� �����: " + localStorage.getItem('userCount') +" �������";
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
function userNoLoginned() // ��������� ��������, ���� ������������ �� ���������
{
	document.getElementById("nasUzheP").innerHTML = "� ���� �����: " + localStorage.getItem('userCount') +" �������";
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
	������ ������:
	userCount - ������� ������������� �� �� ID ������������
	*login* - ������ �������������, � ��� ������������� ��� ���������� � ������������
	loginnedUser - �������� ����� ������������� � ������ ������ ������������
	logOn - �������� ��������� ��������: true - ������������ ���������, false - ����� �� ���������
	
	
*/


// ���������� html - ��������� ��� ����������� ������������ ������� � ��������
let userObjData; // ���������� ��� �������� �������� ������ ������������
var loginWindow = document.createElement('div');  loginWindow.id="loginWindow";
var outButton = document.createElement('div'); outButton.id="outButton";
var userInfoWindow = document.createElement('div'); userInfoWindow.id = "userInfoWindow";
var registrationButton = document.createElement('div');
var registrationWindow = document.createElement('div');
var userListWindow = document.createElement('div'); // ����� ������ ������������� 
var userFriendsListWindow = document.createElement('div'); 
var userSideBarWindow = document.createElement('div'); userSideBarWindow.id = "userSideBarWindow";
var centerWindow = document.createElement('div'); centerWindow.id = "centerWindow";
var rightSideBarWindow = document.createElement('div'); rightSideBarWindow.id = "rightSideBarWindow";
var leftSideBarWindow = document.createElement('div'); leftSideBarWindow.id = "leftSideBarWindow";
var friendsRequestWindow = document.createElement('div'); friendsRequestWindow.id = "friendsRequestWindow"; 
var outgoingRequestToFriendsWindow = document.createElement('div'); outgoingRequestToFriendsWindow.id = "outgoingRequestToFriendsWindow"; 
var userInfoEditWindow = document.createElement('div'); userInfoEditWindow.id = "userInfoEditWindow"; 

// ��������� ������
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
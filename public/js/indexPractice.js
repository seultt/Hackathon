(function(window, document){
  'use strict';
  function addListItem(e){
    if(!input.value.trim()) return ;
    // enter가 들어왔을 경우 또는 클릭이벤트일 경우
    if((e.keyCode === 13) || e.type === 'click'){
      itemPost(input.value);
      input.value = '';
      input.focus();
    }
  }
  // 삭제버튼 클릭 시 data.json의 데이터를 지우는 함수
  function deleteListItem(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('delete', '/toDoList/' + id, true);
    xhr.send(null);                                
    xhr.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          console.log(this.responseText);
        }
      }
    }
  }
  // data.json으로 data를 보내서 저장하는 함수
  function itemPost(str) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/toDoList', true);
    // 내가 보내줄 것이 어플리케이션/json 형식이다. 내가 보내줄 파일형식을 지정해준다. 알려준다.
    xhr.setRequestHeader('Content-type', 'application/json');
    var data = {
      task : str
    };
    // data객체를 string 으로 만들어서 보내준다.
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function (){
      if (this.readyState === 4) {
        if (this.status === 201) {
          console.log(this.responseText);
          var item = JSON.parse(this.responseText);
          insertItem(todoList, item.task, item.id);
        }
      }
    }
  }

  // list item에 추가해주는 함수
  function insertItem(element, task, id){
    element.insertAdjacentHTML('beforeend', '<li class="todo-item">' + task + '<button class="delete">삭제</button></li>');
    bindDeleteButton(id);
  } 
  // deletebutton을 바인딩 시켜주는 함수
  function bindDeleteButton(id){
    var delButton = document.querySelectorAll('.delete');
    console.log('delButton: ', delButton[delButton.length-1]);
    delButton[delButton.length-1].addEventListener('click', function(){
      todoList.removeChild(this.parentNode);
      deleteListItem(id);
    });
  }
  
  var input = document.querySelector('.input');
  console.log('input: ', input);
  var button = document.querySelector('.button');
  console.log('button: ', button);
  var todoList = document.querySelector('.todo-list');
  console.log('todoList: ', todoList);
  
  button.addEventListener('click', addListItem);
  input.addEventListener('keyup', addListItem);
  // CRUD create, read, update, delete
  // HTTP method post, get, put, delete
  var xhr = new XMLHttpRequest();
  xhr.open('get', '/toDoList', true);
  xhr.send(null);
  xhr.onreadystatechange = function(){
    if(this.readyState === 4){
      if(this.status === 200){
        //console.log('this.responseText: ', this.responseText);
        var toDoItemList = JSON.parse(this.responseText);
        //console.log('toDoItemList: ', toDoItemList);
        toDoItemList.forEach(function(item){
          console.log('item.task: ', item.task);
          insertItem(todoList, item.task, item.id);
        });
      }
      else{
        console.error('GET failed');
      }
    }
  };

})(window, document);
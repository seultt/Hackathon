(function (window, document){
  'use strict';
  // data.json안의 데이터 값을 지우자!
  function delItem(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('delete', '/toDoList/' + id, true);
    xhr.send(null);

    xhr.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          
        }
      }
    }
  }

  // delBtn클릭 시 Event
  function delList(id) {
    var delBtn = document.querySelectorAll('.delBtn');
    delBtn[delBtn.length-1].addEventListener('click', function() {
      toDoList.removeChild(this.parentNode);
      // item들을 data.json에서 삭제시키자.
      delItem(id);
    });
  }

  // 인자로 넘어온 ul요소에 값들을 List로 출력한다.
  function showItemList(element, task, id) {
    element.insertAdjacentHTML('beforeend', '<li>' + task + '<button class="delBtn">-</button></li>');
    // delBtn클릭 시 Event
    delList(id);
  }

  // searchBtn 클릭 시 data.json에 있는 정보를 가져온다.
  function showList() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/toDoList', true);
    xhr.send(null);

    xhr.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          var data = JSON.parse(this.responseText);
          data.forEach(function(item) {
            // item들을 List로 출력할 함수를 출력한다.
            showItemList(toDoList, item.task, item.id);
          });
        }
      }
    }
  }

  // inputTask에 입력한 값을 data.json에 저장한다.
  function addInput(str) {
    // 빈 칸 유무 확인
    if(!inputTask.value.trim()) return;
    // data.json과 통신
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/toDoList', true);
    xhr.setRequestHeader('content-type', 'application/json');

    var data = { task : inputTask.value };
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          console.log(this.responseText);
        }
      }
    }
    inputTask.value = '';
    inputTask.focus();
  }

  // inputBtn binding
  var inputBtn = document.getElementById('inputBtn');
  // inputTask binding
  var inputTask = document.getElementById('inputTask');
  // searchBtn binding
  var searchBtn = document.getElementById('searchBtn');
  // toDoList binding
  var toDoList = document.querySelector('.toDoList');

  

  // inputBtn Event //
  inputBtn.addEventListener('click', addInput);
  searchBtn.addEventListener('click', showList);

})(window, document);
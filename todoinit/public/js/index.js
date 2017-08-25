(function (window, document) {
  'use strict';
  
  const plustBtn = document.querySelector('#plus-btn');
  const delBtn = document.querySelector('#del-btn');
  const searchBtn = document.querySelector('#search-btn');
  
  // pd input 요소들을 담을 전체 frame
  const section = document.querySelector('section');
  const inputFrame = document.querySelector('.pd-input');
  const nav = document.querySelector('nav');
  const ul = document.querySelector('.wish-list');
  
  showItemList();

  plustBtn.addEventListener('click', () => {
    inputFrame.innerHTML = '';
    inputFrame.insertAdjacentHTML(`beforeend`, `<input type="text" class="common pd-name" placeHolder="이름">
    <input type="text" class="common pd-price" placeHolder="가격">
    <input type="text" class="common pd-shop" placeHolder="구매처">
    <input type="text" class="common pd-url" placeHolder="url">
    <input type="text" class="common pd-memo" placeHolder="메모">
    <button id="pd-add-btn" class="btn btn-danger">등록</button>
    `); 

    const pdAddBtn = document.getElementById('pd-add-btn');
    const pdCancelBtn = document.getElementById('pd-cancel-btn');

    pdAddBtn.addEventListener('click', () => {
      let name = document.querySelector('.pd-name');
      let price = document.querySelector('.pd-price');
      let shop = document.querySelector('.pd-shop');
      let url = document.querySelector('.pd-url');
      let memo= document.querySelector('.pd-memo');

      // ------ 통신하여 등록시키기 -------
      const xhr = new XMLHttpRequest();

      xhr.open('post', '/wishList', true);
      xhr.setRequestHeader('content-type', 'application/json');
      const data = { name: name.value, price: price.value, shop: shop.value, url: url.value, memo: memo.value };
      xhr.send(JSON.stringify(data));

      xhr.onreadystatechange = function() {
        if(this.readyState === 4) {
          if(this.status === 200) {
            console.log(this.responseText);
          }
        }
      }
      // ------ 등록 하는 통신 끝 -------
      showItemList();

      name.value = '';
      price.value ='';
      shop.value = '';
      url.value = '';
      memo.value = '';
      name.focus();
      
      // 취소 버튼 클릭 시 이벤트
      pdCancelBtn.addEventListener( 'click', () => {
        alert('취소');
      });
    });
    // --------- 통신 끝 -----------
  });

  // 삭제 버튼 클릭 시 이벤트
  delBtn.addEventListener('click', () => {
    const checked = document.querySelectorAll('li input[type="checkbox"]:checked');
    for(let i=0; i<checked.length; i++) {
      console.log(checked[i].dataset.id);
      delItem(checked[i].dataset.id);
    }
    showItemList();
  });

  // 받은 인자값을 id로 하여 데이터 지우기
  function delItem(num) {
    var xhr = new XMLHttpRequest();
    xhr.open('delete', '/wishList/' + num, true);
    xhr.send(null);

    xhr.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
        }
      }
    }
  }

  // 화면에 데이터를 읽어와 출력하는 함수
  function showItemList(str) {
    ul.innerHTML = '';
    // ----- 통신하여 데이터 가져오기 -----
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/wishList', true);
    xhr.send(null);
    
    xhr.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          let data = JSON.parse(this.responseText);
          data.forEach(function(item) {
            // item들을 List로 출력할 함수를 출력한다.
            ul.insertAdjacentHTML(`beforeend`,`<li class="item-box">
            <input class="hidden" type="checkbox" data-id=${item.id} id="${item.id}">
            <label for="${item.id}">
              <ul>
                <li class="size"><img src="${item.url}"></li>
                <li>${item.name}</li>
                <li>${item.price}</li>
                <li>${item.shop}</li>
                <li>${item.memo}</li>
              </ul>
            </label>
          </li>`);
          });
        }
      }
    }
  }


  // search button click 이벤트
  searchBtn.addEventListener('click', () => {
    let textValue = document.querySelector('.search-box > input');
    // 만약 빈 문자를 입력 받으면 전체가 조회!
    if(!textValue.value.trim()) {
      showItemList();
    }
    else {
      const xhr = new XMLHttpRequest();
      xhr.open('get', '/wishList', true);
      xhr.send(null);

      xhr.onreadystatechange = function() {
        if(this.readyState === 4) {
          if(this.status === 200) {
            let data = JSON.parse(this.responseText);
            let filteredData = data.filter(function(item) {
              let check = false;
              for (let prop in item){
                let reg = new RegExp(textValue.value);
                if(reg.test(item[prop])) check = true;
              }
              return check; 
            });
            console.log('data',filteredData);
            ul.innerHTML = '';
            for(let i=0; i<filteredData.length; i++) {
              console.log(filteredData[i].name);
              ul.insertAdjacentHTML(`beforeend`,`<li class="item-box">
              <input class="hidden" type="checkbox" data-id=${filteredData[i].id} id="${filteredData[i].id}">
              <label for="${filteredData[i].id}">
                <ul>
                  <li class="size"><img src="${filteredData[i].url}"></li>
                  <li>${filteredData[i].name}</li>
                  <li>${filteredData[i].price}</li>
                  <li>${filteredData[i].shop}</li>
                  <li>${filteredData[i].memo}</li>
                </ul>
              </label>
            </li>`);
            }
          }
        }
      }
    }
  });


})(window, document);
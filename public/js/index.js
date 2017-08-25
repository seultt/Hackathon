(function (window, document) {
  'use strict';
  
  const plustBtn = document.querySelector('#plus-btn');
  const delBtn = document.querySelector('#del-btn');
  
  // pd input 요소들을 담을 전체 frame
  const section = document.querySelector('section');
  const nav = document.querySelector('nav');
  const ul = document.querySelector('.wish-list');
  

  plustBtn.addEventListener('click', () => {
    nav.insertAdjacentHTML(`afterend`, `<div class="pd-input">
    <input type="text" class="pd-name" placeHolder="이름">
    <input type="text" class="pd-price" placeHolder="가격">
    <input type="text" class="pd-shop" placeHolder="구매처">
    <input type="text" class="pd-url" placeHolder="url">
    <input type="text" class="pd-memo" placeHolder="메모">
    <button id="pd-add-btn">등록</button> <button id="pd-cancel-btn">취소</button>
    </div>`);

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
      
      pdCancelBtn.addEventListener( 'click', () => {
        alert('');
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
          alert('삭제 되었습니다.');
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
            ul.insertAdjacentHTML(`beforeend`,`<li>`+ `<input type="checkbox" data-id=${item.id}>` + item.name +`|`+ item.price +`|`+ item.shop +`|`+ item.url +`|`+ item.memo + `</li>`);
          });
        }
      }
    }
  }


})(window, document);
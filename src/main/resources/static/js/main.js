$(document).ready(function() {

    // 이전 버튼 클릭 (앨범 이벤트 배너)
    $('.button-prev').click(function(){
        $('.long_img:last').prependTo('.long_box');
        $('.long_box').css('margin-left', -1200);
        $('.long_box').stop().animate({marginLeft: 0}, 800);

    });

    // 다음 버튼 클릭
    $('.button-next').click(function(){
        $('.long_box').stop().animate({marginLeft: -1200}, 800, function() {
            $('.long_img:first').appendTo('.long_box');
            $('.long_box').css('margin-left', 0);
        });
    });

    //item-detail 슬라이드
    $('.item-detail').each(function() {
        var text = $(this).text();         // 텍스트 내용 가져오기
        var maxLength = 50;               // 텍스트 최대 길이
        var minDuration = 10;              // 최소 애니메이션 시간 (기본 속도)
        var maxDuration = 20;              // 최대 애니메이션 시간 (긴 텍스트에 대해서 속도 느리게)

        if (text.length > maxLength) {
            // 텍스트의 길이에 맞게 애니메이션 시간을 설정 (길이가 길수록 애니메이션이 느려짐)
            var animationDuration = Math.min(minDuration + (text.length / maxLength) * 15, maxDuration);
            // 동적으로 애니메이션 속도 설정
            $(this).find('.slide-text').css('animation-duration', animationDuration + 's');
        }
    });

});

document.addEventListener("DOMContentLoaded", function() {
    // 모든 가격 요소에 대해 쉼표 추가 처리
    document.querySelectorAll('.price').forEach(function(element) {
        var price = element.innerText.trim().replace("원", "");  // 원화 기호 제거
        var formattedPrice = Number(price).toLocaleString();  // 쉼표 추가
        element.innerText = formattedPrice + "원";  // 쉼표 추가된 가격 + 원화 기호
    });
});

/*width:100% 앨범 발매 안내 배너(슬라이드)*/
$(document).ready(function() {
    let currentIndex = 0; // 현재 슬라이드 인덱스
    const totalSlides = $('.slider li').length; // 슬라이드의 총 개수

    // 슬라이드에 대응하는 배경 이미지 배열 (각 슬라이드마다 배경 이미지 경로 지정)
    const backgrounds = [
        'url("/image/slider_b.png")',
        'url("/image/slider_b2.png")',
        'url("/image/slider_b3.png")',
        'url("/image/slider_b4.png")',
        'url("/image/slider_b5.png")'
    ];

    // 슬라이드에 대응하는 문구 배열
    const texts = [
        'PLAVE 3rd Mini Album <br> 초도한정 특전 SHOE CHARM(랜덤 1종) 증정!',
        '제니(JENNIE), 첫번째 <br> 솔로 정규앨범 [Ruby] <br> 발매!',
        '승리의 여신 : 니케 O.S.T <br> 세트 상품 구매시 <br> 버스트덱 프레임 증정!',
        '지수 - 미니앨범 AMORTAGE <br> 초도 한정 KEY TAG<br>(랜덤 1종) 온팩 증정!',
        '아크 - 미니 2집 <br> 특전 포토카드(7종 중 <br> 1종 랜덤) 별도증정!'
    ];

    // 배경 이미지를 변경하는 함수
    function changeBackgroundImage() {
        $('#background_color').css({
            'background-image': backgrounds[currentIndex],
            'transition': 'background-image 0.8s ease-in-out'
        });

        // 문구 변경 (html 메서드를 사용하여 <br> 태그 포함)
        $('.promotion h4').fadeOut(300, function() {
            $(this).html(texts[currentIndex]).fadeIn(300); // html() 메서드를 사용하여 <br> 태그 포함된 문구 변경
        });
    }

    // 슬라이드 이동 함수 (다음 슬라이드로 이동)
    function moveNext() {
        $('.slider').stop().animate({ marginLeft: -805 }, 800, function () {
            $('.slider li:first').appendTo('.slider');
            $('.slider').css({ marginLeft: 0 });
        });

        // 슬라이드 전환 후 배경 이미지와 문구 변경
        currentIndex = (currentIndex + 1) % totalSlides; // 인덱스 업데이트
        changeBackgroundImage(); // 배경 이미지 및 문구 변경
    }

    // 이전 버튼 클릭 이벤트
    $('.prev').click(function () {
        $('.slider li:last').prependTo('.slider');
        $('.slider').css('margin-left', -805);
        $('.slider').stop().animate({ marginLeft: 0 }, 800);

        // 이전 버튼 클릭 후 배경 이미지와 문구 변경
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // 인덱스 업데이트
        changeBackgroundImage(); // 배경 이미지 및 문구 변경
    });

    // 다음 버튼 클릭 이벤트
    $('.next').click(function () {
        moveNext(); // 다음 슬라이드로 이동
    });

    // 초기 배경 이미지 설정
    changeBackgroundImage(); // 페이지 로드 시 처음 배경 이미지 및 문구 설정
});

//fastapi 추천 상품 리스트
window.onload = async function () {
    try {
        // member_id를 하드코딩으로 예시
        const member_id = 2;  // 실제 로그인된 사용자 ID로 대체해야 합니다.

        // API 호출 (FastAPI에서 추천 상품 데이터 받기)
        const response = await axios.get(`http://127.0.0.1:8000/recommend/${member_id}`);
        const recommendations = response.data.recommendations;

        if (recommendations.length === 0) {
            alert("추천 상품이 없습니다.");
            return;
        }

        // 추천 상품을 카드 형태로 생성하여 div에 삽입
        const container = document.querySelector("#product-cards-container");  // 수정된 container ID

        recommendations.forEach((recommend, index) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");

            // 가격에 쉼표 추가
            const formattedPrice = recommend.price.toLocaleString();  // 숫자에 쉼표 추가

            const productLink = document.createElement("a");
            productLink.classList.add("product-link");

            // 추천 상품이 있는 경우 링크를 추천 링크로, 없으면 기본 링크로 설정
            const link = recommend.link ? recommend.link : `http://localhost:8081/item/${recommend.item_id}`;
            productLink.href = link;  // 상품 링크 설정

            productLink.innerHTML = `
                <h5 class="prod_num">${index + 1}</h5>  <!-- index + 1을 JavaScript에서 처리 -->
                <img src="${recommend.item_img}" alt="${recommend.item_nm}" class="product-image">
                <div class="product-info">
                    <h6 class="product-name">${recommend.item_detail}</h6>
                    <p class="artist-name">${recommend.item_nm}</p>
                    <p class="product-price">${formattedPrice}원</p>  <!-- 쉼표 추가된 가격 표시 -->
                </div>
            `;

            // 카드 div에 <a> 태그를 넣기
            productDiv.appendChild(productLink);
            container.appendChild(productDiv);
        });

        // 카드들을 선택
        const cards = document.querySelectorAll('.product-card');
        let activeIndex = 0;  // 처음 활성화 할 카드 인덱스

        // 처음에 가운데 카드를 활성화
        cards[activeIndex].classList.add('active');

        // 슬라이드 기능 구현
        function slideCards() {
            // 현재 활성화된 카드를 비활성화
            cards[activeIndex].classList.remove('active');

            // 인덱스를 하나 증가시켜서 카드 순서 변경
            activeIndex = (activeIndex + 1) % cards.length;

            // 새로운 카드 활성화
            cards[activeIndex].classList.add('active');
        }

        setInterval(slideCards, 2000);  // 2초마다 슬라이드

    } catch (error) {
        console.error("추천 상품을 불러오는 데 실패했습니다.", error);
    }
};

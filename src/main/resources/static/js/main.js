$(document).ready(function() {
    // 이전/다음 버튼 클릭 (앨범 이벤트 배너)
    const $longBox = $('.long_box');
    const $slider = $('.slider');
    const $promotionText = $('.promotion h4');
    const $backgroundColor = $('#background_color');

    // 이전 버튼
    $('.button-prev').click(function(){
        $('.long_img:last').prependTo($longBox);
        $longBox.css('margin-left', -1200).stop().animate({marginLeft: 0}, 800);
    });

    // 다음 버튼
    $('.button-next').click(function(){
        $longBox.stop().animate({marginLeft: -1200}, 800, function() {
            $('.long_img:first').appendTo($longBox);
            $longBox.css('margin-left', 0);
        });
    });

    // item-detail 슬라이드
    $('.item-detail').each(function() {
        var text = $(this).text();
        if (text.length > 50) {
            var animationDuration = Math.min(10 + (text.length / 50) * 15, 20);
            $(this).find('.slide-text').css('animation-duration', `${animationDuration}s`);
        }
    });

    // 앨범 발매 안내 배너 슬라이드
    let currentIndex = 0;
    const totalSlides = $('.slider li').length;
    const backgrounds = [
        'url("/image/slider_b.png")',
        'url("/image/slider_b2.png")',
        'url("/image/slider_b3.png")',
        'url("/image/slider_b4.png")',
        'url("/image/slider_b5.png")'
    ];
    const texts = [
        'PLAVE 3rd Mini Album <br> 초도한정 특전 SHOE CHARM(랜덤 1종) 증정!',
        '제니(JENNIE), 첫번째 <br> 솔로 정규앨범 [Ruby] <br> 발매!',
        '승리의 여신 : 니케 O.S.T <br> 세트 상품 구매시 <br> 버스트덱 프레임 증정!',
        '지수 - 미니앨범 AMORTAGE <br> 초도 한정 KEY TAG<br>(랜덤 1종) 온팩 증정!',
        '아크 - 미니 2집 <br> 특전 포토카드(7종 중 <br> 1종 랜덤) 별도증정!'
    ];

    function changeBackgroundImage() {
        $backgroundColor.css({
            'background-image': backgrounds[currentIndex],
            'transition': 'background-image 0.8s ease-in-out'
        });

        $promotionText.fadeOut(300, function() {
            $(this).html(texts[currentIndex]).fadeIn(300);
        });
    }

    function moveNext() {
        $slider.stop().animate({ marginLeft: -805 }, 800, function() {
            $('.slider li:first').appendTo($slider);
            $slider.css({ marginLeft: 0 });
        });

        currentIndex = (currentIndex + 1) % totalSlides;
        changeBackgroundImage();
    }

    // 이전/다음 버튼 클릭 이벤트
    $('.prev').click(function() {
        $('.slider li:last').prependTo($slider);
        $slider.css('margin-left', -805).stop().animate({ marginLeft: 0 }, 800);
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        changeBackgroundImage();
    });

    $('.next').click(moveNext);
    changeBackgroundImage();

    // 가격에 쉼표 추가 처리
    document.querySelectorAll('.price').forEach(function(element) {
        const price = element.innerText.trim().replace("원", "");
        const formattedPrice = Number(price).toLocaleString();
        element.innerText = `${formattedPrice}원`;
    });

    // 추천 상품 리스트
    const member_id = 2;
    const container = document.querySelector("#product-cards-container");

    window.onload = async function () {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/recommend/${member_id}`);
            const recommendations = response.data.recommendations;

            if (!recommendations.length) return alert("추천 상품이 없습니다.");

            recommendations.forEach((recommend, index) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product-card");
                const formattedPrice = recommend.price.toLocaleString();
                const productLink = document.createElement("a");
                productLink.classList.add("product-link");
                const link = recommend.link || `http://localhost:8081/item/${recommend.item_id}`;
                productLink.href = link;

                productLink.innerHTML = `
                    <h5 class="prod_num">${index + 1}</h5>
                    <img src="${recommend.item_img}" alt="${recommend.item_nm}" class="product-image">
                    <div class="product-info">
                        <h6 class="product-name">${recommend.item_detail}</h6>
                        <p class="artist-name">${recommend.item_nm}</p>
                        <p class="product-price">${formattedPrice}원</p>
                    </div>
                `;
                productDiv.appendChild(productLink);
                container.appendChild(productDiv);
            });

            const cards = document.querySelectorAll('.product-card');
            let activeIndex = 0;
            cards[activeIndex].classList.add('active');
            setInterval(function() {
                cards[activeIndex].classList.remove('active');
                activeIndex = (activeIndex + 1) % cards.length;
                cards[activeIndex].classList.add('active');
            }, 2000);

        } catch (error) {
            console.error("추천 상품을 불러오는 데 실패했습니다.", error);
        }
    };
});

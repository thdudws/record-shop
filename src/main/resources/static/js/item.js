$(document).ready(function() {
    // 가격 쉼표 추가 처리
    document.querySelectorAll('.price').forEach(function(element) {
        var priceText = element.innerText.trim().replace("원", "").replace(/,/g, ""); // 원화 기호와 쉼표 제거
        var price = parseFloat(priceText) || 0; // 숫자 변환 시 실패하면 0으로 처리
        var formattedPrice = price.toLocaleString();
        element.innerText = `${formattedPrice}원`;  // 쉼표 추가된 가격 + 원화 기호
    });

    // 수량 변경 시 총액 계산
    $("#count").change(calculateTotalPrice);

    // 상품 주문
    function order() {
        var paramData = {
            itemId: $("#itemId").val(),
            count: $("#count").val()
        };
        sendAjaxRequest("/order", paramData, function() {
            alert("주문이 완료 되었습니다.");
            location.href = '/';
        });
    }

    // 장바구니 추가
    function addCart() {
        var paramData = {
            itemId: $("#itemId").val(),
            count: $("#count").val()
        };
        sendAjaxRequest("/cart", paramData, function() {
            alert("상품을 장바구니에 담았습니다.");
            location.href = '/cart';
        });
    }

    // 총 가격 계산
    function calculateTotalPrice() {
        var count = $("#count").val();
        var price = $("#price").val();
        var totalPrice = price * count;
        var formattedPrice = totalPrice.toLocaleString();
        $("#totalPrice").html(`${formattedPrice}원`);
    }

    // 공통 AJAX 요청 함수
    function sendAjaxRequest(url, paramData, successCallback) {
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(paramData),
            dataType: "json",
            cache: false,
            success: successCallback,
            error: function(jqXHR) {
                if (jqXHR.status == 401) {
                    alert('로그인 후 이용해주세요');
                    location.href = '/members/login';
                } else {
                    alert(jqXHR.responseText);
                }
            }
        });
    }

    // 배송 정보 토글
    $(".delivery-content").hide();
    $(".delivery-title-box").click(function() {
        $(".delivery-content").toggle();
        $(".down_img img").toggleClass("rotate");

        var currentRotation = $(this).data('rotation') || 0;
        currentRotation += 180;
        $(this).data('rotation', currentRotation);
        $(".down_img img").css('transform', `rotate(${currentRotation}deg)`);
    });

    // 에러 메시지 처리
    var errorMessage = $('#errorMessage').data('error-message');
    if (errorMessage) {
        alert(errorMessage);
    }

    // 파일 업로드 확장자 검사
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();  // 이미지 파일명
        var fileExt = fileName.split('.').pop().toLowerCase();  // 확장자 추출

        if (!['jpg', 'jpeg', 'gif', 'png', 'bmp'].includes(fileExt)) {
            alert("이미지 파일만 등록이 가능합니다.");
            return;
        }

        $(this).siblings(".custom-file-label").html(fileName);
    });

    // 검색 버튼 클릭
    $("#searchBtn").on("click", function(e) {
        e.preventDefault();
        page(0);
    });

    // 페이지 이동 함수
    function page(page) {
        var searchDateType = $("#searchDateType").val();
        var searchSellStatus = $("#searchSellStatus").val();
        var searchBy = $("#searchBy").val();
        var searchQuery = $("#searchQuery").val();

        location.href = `/admin/items/${page}?searchDateType=${searchDateType}&searchSellStatus=${searchSellStatus}&searchBy=${searchBy}&searchQuery=${searchQuery}`;
    }
});

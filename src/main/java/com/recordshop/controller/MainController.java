package com.recordshop.controller;

import com.recordshop.detail.PrincipalDetails;
import com.recordshop.dto.ItemSearchDto;
import com.recordshop.dto.MainItemDto;
import com.recordshop.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Controller
@Log4j2
@RequiredArgsConstructor
public class MainController {

    private final ItemService itemService;

    // 메인 페이지
    @GetMapping(value = "/")
    public String main(ItemSearchDto itemSearchDto, Optional<Integer> page, Model model,
                       @AuthenticationPrincipal PrincipalDetails principalDetails) {

        // 로그인된 사용자 정보가 있을 경우, 사용자 이름 추가
        if (principalDetails != null) {
            model.addAttribute("username", principalDetails.getMember().getNickName());
        }

        // 페이지네이션 설정
        Pageable pageable = PageRequest.of(page.isPresent() ? page.get() : 0, 6);

        // 상품 목록 불러오기
        List<MainItemDto> items = itemService.getItems();
        Page<MainItemDto> itemPage = itemService.getMainItemPage(itemSearchDto, pageable);

        // 로깅
        log.info("-------->: " + items);
        log.info("-------->: " + itemPage);

        // 모델에 데이터 추가
        model.addAttribute("items", items);
        model.addAttribute("item", itemPage);
        model.addAttribute("itemSearchDto", itemSearchDto);
        model.addAttribute("maxPage", 5);

        return "main";  // 메인 페이지 템플릿 반환
    }
}

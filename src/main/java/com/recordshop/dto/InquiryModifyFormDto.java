package com.recordshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InquiryModifyFormDto {

    @NotBlank(message = "제목은 필수 입력사항 입니다.")
    private String title;

    @NotBlank(message = "내용은 필수 입력사항 입니다.")
    private String content;
}

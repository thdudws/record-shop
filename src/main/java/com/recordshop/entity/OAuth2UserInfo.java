package com.recordshop.entity;

public interface OAuth2UserInfo {

    String getProvider();

    String getProviderId();

    String getName();

    String getEmail();
}

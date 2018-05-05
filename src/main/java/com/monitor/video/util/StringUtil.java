package com.monitor.video.util;

public class StringUtil {

    public static int  digitalIndex(String str) {
        for(int i =0; i < str.length(); i++ ){
            int chr = str.charAt(i);
            if(chr >= 48 && chr <= 57)
                return i;
        }
        return -1;
    }
}

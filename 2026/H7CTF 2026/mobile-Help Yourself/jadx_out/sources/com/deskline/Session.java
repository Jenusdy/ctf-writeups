package com.deskline;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.UUID;

/* loaded from: classes.dex */
public class Session {
    private final SharedPreferences sp;

    public Session(Context context) {
        this.sp = context.getSharedPreferences("deskline", 0);
    }

    public String deviceId() {
        String string = this.sp.getString("device_id", null);
        if (string == null) {
            String str = "dsk-" + UUID.randomUUID().toString();
            this.sp.edit().putString("device_id", str).apply();
            return str;
        }
        return string;
    }

    public String baseUrl() {
        return this.sp.getString("base_url", "http://10.0.2.2:8080");
    }

    public void setBaseUrl(String str) {
        while (str.endsWith("/")) {
            str = str.substring(0, str.length() - 1);
        }
        this.sp.edit().putString("base_url", str).apply();
    }

    public String token() {
        return this.sp.getString("token", null);
    }

    public void setToken(String str) {
        this.sp.edit().putString("token", str).apply();
    }
}

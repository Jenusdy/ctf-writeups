package com.deskline;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

/* loaded from: classes.dex */
public class ApiClient {
    public static final String CLIENT_HEADER = "Deskline-Android/1.6.0";

    public static class Resp {
        public String body;
        public int code;
    }

    public static Resp post(String str, String str2, Map<String, String> map) throws Exception {
        HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(str).openConnection();
        httpURLConnection.setRequestMethod("POST");
        httpURLConnection.setConnectTimeout(8000);
        httpURLConnection.setReadTimeout(8000);
        httpURLConnection.setRequestProperty("Content-Type", "application/json");
        if (map != null) {
            for (Map.Entry<String, String> entry : map.entrySet()) {
                httpURLConnection.setRequestProperty(entry.getKey(), entry.getValue());
            }
        }
        httpURLConnection.setDoOutput(true);
        OutputStream outputStream = httpURLConnection.getOutputStream();
        try {
            outputStream.write(str2.getBytes("UTF-8"));
            if (outputStream != null) {
                outputStream.close();
            }
            return read(httpURLConnection);
        } catch (Throwable th) {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (Throwable th2) {
                    th.addSuppressed(th2);
                }
            }
            throw th;
        }
    }

    public static Resp get(String str, Map<String, String> map) throws Exception {
        HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(str).openConnection();
        httpURLConnection.setRequestMethod("GET");
        httpURLConnection.setConnectTimeout(8000);
        httpURLConnection.setReadTimeout(8000);
        if (map != null) {
            for (Map.Entry<String, String> entry : map.entrySet()) {
                httpURLConnection.setRequestProperty(entry.getKey(), entry.getValue());
            }
        }
        return read(httpURLConnection);
    }

    private static Resp read(HttpURLConnection httpURLConnection) throws Exception {
        Resp resp = new Resp();
        resp.code = httpURLConnection.getResponseCode();
        InputStream errorStream = resp.code >= 400 ? httpURLConnection.getErrorStream() : httpURLConnection.getInputStream();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        if (errorStream != null) {
            byte[] bArr = new byte[4096];
            while (true) {
                int i = errorStream.read(bArr);
                if (i <= 0) {
                    break;
                }
                byteArrayOutputStream.write(bArr, 0, i);
            }
        }
        resp.body = byteArrayOutputStream.toString("UTF-8");
        httpURLConnection.disconnect();
        return resp;
    }
}

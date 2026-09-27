package com.deskline;

import android.app.Activity;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import com.deskline.ApiClient;
import java.util.HashMap;
import org.json.JSONException;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class MainActivity extends Activity {
    private EditText serverField;
    private Session session;
    private TextView status;
    private TextView tickets;

    @Override // android.app.Activity
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        this.session = new Session(this);
        setContentView(R.layout.activity_main);
        this.serverField = (EditText) findViewById(R.id.server);
        this.status = (TextView) findViewById(R.id.status);
        this.tickets = (TextView) findViewById(R.id.tickets);
        this.serverField.setText(this.session.baseUrl());
        findViewById(R.id.sync).setOnClickListener(new View.OnClickListener() { // from class: com.deskline.MainActivity.1
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                MainActivity.this.session.setBaseUrl(MainActivity.this.serverField.getText().toString().trim());
                MainActivity.this.sync();
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void sync() {
        this.status.setText("Syncing queue...");
        final String strBaseUrl = this.session.baseUrl();
        new Thread(new Runnable() { // from class: com.deskline.MainActivity.2
            @Override // java.lang.Runnable
            public void run() throws JSONException {
                String str;
                ApiClient.Resp respPost;
                int i;
                MainActivity mainActivity;
                try {
                    HashMap map = new HashMap();
                    map.put("X-Deskline-Client", ApiClient.CLIENT_HEADER);
                    respPost = ApiClient.post(strBaseUrl + "/api/v1/auth/device", new JSONObject().put("device_id", MainActivity.this.session.deviceId()).toString(), map);
                    i = respPost.code;
                    mainActivity = MainActivity.this;
                } catch (Exception e) {
                    str = "Error: " + e.getMessage();
                }
                if (i != 200) {
                    mainActivity.post("Auth failed (" + respPost.code + ")");
                    return;
                }
                mainActivity.session.setToken(new JSONObject(respPost.body).getString("token"));
                HashMap map2 = new HashMap();
                map2.put("Authorization", "Bearer " + MainActivity.this.session.token());
                ApiClient.Resp resp = ApiClient.get(strBaseUrl + "/api/v1/sync", map2);
                if (resp.code != 200) {
                    MainActivity.this.post("Sync failed (" + resp.code + ")");
                } else {
                    new DeskDb(MainActivity.this).seedFromSync(resp.body);
                    str = "Queue synced";
                    MainActivity.this.post(str);
                    MainActivity.this.renderTickets();
                }
            }
        }).start();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void renderTickets() {
        final StringBuilder sb = new StringBuilder();
        try {
            SQLiteDatabase readableDatabase = new DeskDb(this).getReadableDatabase();
            Cursor cursorRawQuery = readableDatabase.rawQuery("SELECT subject, body FROM tickets", null);
            while (cursorRawQuery.moveToNext()) {
                sb.append("• ").append(cursorRawQuery.getString(0)).append("\n    ").append(cursorRawQuery.getString(1)).append("\n\n");
            }
            cursorRawQuery.close();
            readableDatabase.close();
        } catch (Exception e) {
        }
        runOnUiThread(new Runnable() { // from class: com.deskline.MainActivity.3
            @Override // java.lang.Runnable
            public void run() {
                MainActivity.this.tickets.setText(sb.toString());
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void post(final String str) {
        runOnUiThread(new Runnable() { // from class: com.deskline.MainActivity.4
            @Override // java.lang.Runnable
            public void run() {
                MainActivity.this.status.setText(str);
            }
        });
    }
}

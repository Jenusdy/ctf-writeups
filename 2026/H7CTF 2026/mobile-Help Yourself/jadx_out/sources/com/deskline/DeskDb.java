package com.deskline;

import android.content.ContentValues;
import android.content.Context;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import org.json.JSONArray;
import org.json.JSONObject;

/* loaded from: classes.dex */
public class DeskDb extends SQLiteOpenHelper {
    public DeskDb(Context context) {
        super(context, "deskline.db", (SQLiteDatabase.CursorFactory) null, 1);
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onCreate(SQLiteDatabase sQLiteDatabase) throws SQLException {
        sQLiteDatabase.execSQL("CREATE TABLE tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT, body TEXT)");
        sQLiteDatabase.execSQL("CREATE TABLE credentials (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, value TEXT)");
    }

    @Override // android.database.sqlite.SQLiteOpenHelper
    public void onUpgrade(SQLiteDatabase sQLiteDatabase, int i, int i2) {
    }

    public void seedFromSync(String str) throws Exception {
        JSONObject jSONObject = new JSONObject(str);
        SQLiteDatabase writableDatabase = getWritableDatabase();
        writableDatabase.delete("tickets", null, null);
        writableDatabase.delete("credentials", null, null);
        JSONArray jSONArray = jSONObject.getJSONArray("tickets");
        for (int i = 0; i < jSONArray.length(); i++) {
            JSONObject jSONObject2 = jSONArray.getJSONObject(i);
            ContentValues contentValues = new ContentValues();
            contentValues.put("subject", jSONObject2.getString("subject"));
            contentValues.put("body", jSONObject2.getString("body"));
            writableDatabase.insert("tickets", null, contentValues);
        }
        JSONObject jSONObject3 = jSONObject.getJSONObject("internal");
        ContentValues contentValues2 = new ContentValues();
        contentValues2.put("label", jSONObject3.getString("label"));
        contentValues2.put("value", jSONObject3.getString("value"));
        writableDatabase.insert("credentials", null, contentValues2);
        writableDatabase.close();
    }
}

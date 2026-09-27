package com.deskline;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;

/* loaded from: classes.dex */
public class TicketProvider extends ContentProvider {
    @Override // android.content.ContentProvider
    public boolean onCreate() {
        return true;
    }

    @Override // android.content.ContentProvider
    public Cursor query(Uri uri, String[] strArr, String str, String[] strArr2, String str2) {
        SQLiteDatabase readableDatabase = new DeskDb(getContext()).getReadableDatabase();
        String str3 = "SELECT id, subject, body FROM tickets";
        if (str != null && str.trim().length() > 0) {
            str3 = "SELECT id, subject, body FROM tickets WHERE " + str;
        }
        if (str2 != null && str2.trim().length() > 0) {
            str3 = str3 + " ORDER BY " + str2;
        }
        return readableDatabase.rawQuery(str3, null);
    }

    @Override // android.content.ContentProvider
    public String getType(Uri uri) {
        return "vnd.android.cursor.dir/vnd.com.deskline.tickets";
    }

    @Override // android.content.ContentProvider
    public Uri insert(Uri uri, ContentValues contentValues) {
        return null;
    }

    @Override // android.content.ContentProvider
    public int delete(Uri uri, String str, String[] strArr) {
        return 0;
    }

    @Override // android.content.ContentProvider
    public int update(Uri uri, ContentValues contentValues, String str, String[] strArr) {
        return 0;
    }
}

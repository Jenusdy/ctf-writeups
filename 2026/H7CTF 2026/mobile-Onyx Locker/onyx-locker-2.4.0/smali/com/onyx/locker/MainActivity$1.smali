.class Lcom/onyx/locker/MainActivity$1;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Landroid/view/View$OnClickListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/onyx/locker/MainActivity;->onCreate(Landroid/os/Bundle;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/onyx/locker/MainActivity;


# direct methods
.method constructor <init>(Lcom/onyx/locker/MainActivity;)V
    .locals 0

    .line 30
    iput-object p1, p0, Lcom/onyx/locker/MainActivity$1;->this$0:Lcom/onyx/locker/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onClick(Landroid/view/View;)V
    .locals 1

    .line 32
    iget-object p1, p0, Lcom/onyx/locker/MainActivity$1;->this$0:Lcom/onyx/locker/MainActivity;

    invoke-static {p1}, Lcom/onyx/locker/MainActivity;->-$$Nest$fgetsession(Lcom/onyx/locker/MainActivity;)Lcom/onyx/locker/Session;

    move-result-object p1

    iget-object v0, p0, Lcom/onyx/locker/MainActivity$1;->this$0:Lcom/onyx/locker/MainActivity;

    invoke-static {v0}, Lcom/onyx/locker/MainActivity;->-$$Nest$fgetserverField(Lcom/onyx/locker/MainActivity;)Landroid/widget/EditText;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/EditText;->getText()Landroid/text/Editable;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Lcom/onyx/locker/Session;->setBaseUrl(Ljava/lang/String;)V

    .line 33
    iget-object p1, p0, Lcom/onyx/locker/MainActivity$1;->this$0:Lcom/onyx/locker/MainActivity;

    invoke-static {p1}, Lcom/onyx/locker/MainActivity;->-$$Nest$msync(Lcom/onyx/locker/MainActivity;)V

    .line 34
    return-void
.end method

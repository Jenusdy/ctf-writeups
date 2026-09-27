.class Lcom/onyx/locker/MainActivity$3;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/onyx/locker/MainActivity;->post(Ljava/lang/String;Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/onyx/locker/MainActivity;

.field final synthetic val$display:Ljava/lang/String;

.field final synthetic val$msg:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/onyx/locker/MainActivity;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 99
    iput-object p1, p0, Lcom/onyx/locker/MainActivity$3;->this$0:Lcom/onyx/locker/MainActivity;

    iput-object p2, p0, Lcom/onyx/locker/MainActivity$3;->val$msg:Ljava/lang/String;

    iput-object p3, p0, Lcom/onyx/locker/MainActivity$3;->val$display:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .line 101
    iget-object v0, p0, Lcom/onyx/locker/MainActivity$3;->this$0:Lcom/onyx/locker/MainActivity;

    invoke-static {v0}, Lcom/onyx/locker/MainActivity;->-$$Nest$fgetstatus(Lcom/onyx/locker/MainActivity;)Landroid/widget/TextView;

    move-result-object v0

    iget-object v1, p0, Lcom/onyx/locker/MainActivity$3;->val$msg:Ljava/lang/String;

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 102
    iget-object v0, p0, Lcom/onyx/locker/MainActivity$3;->this$0:Lcom/onyx/locker/MainActivity;

    invoke-static {v0}, Lcom/onyx/locker/MainActivity;->-$$Nest$fgetvault(Lcom/onyx/locker/MainActivity;)Landroid/widget/TextView;

    move-result-object v0

    iget-object v1, p0, Lcom/onyx/locker/MainActivity$3;->val$display:Ljava/lang/String;

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 103
    return-void
.end method

.class public Lcom/onyx/locker/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.java"


# instance fields
.field private serverField:Landroid/widget/EditText;

.field private session:Lcom/onyx/locker/Session;

.field private status:Landroid/widget/TextView;

.field private vault:Landroid/widget/TextView;


# direct methods
.method static bridge synthetic -$$Nest$fgetserverField(Lcom/onyx/locker/MainActivity;)Landroid/widget/EditText;
    .locals 0

    iget-object p0, p0, Lcom/onyx/locker/MainActivity;->serverField:Landroid/widget/EditText;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetsession(Lcom/onyx/locker/MainActivity;)Lcom/onyx/locker/Session;
    .locals 0

    iget-object p0, p0, Lcom/onyx/locker/MainActivity;->session:Lcom/onyx/locker/Session;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetstatus(Lcom/onyx/locker/MainActivity;)Landroid/widget/TextView;
    .locals 0

    iget-object p0, p0, Lcom/onyx/locker/MainActivity;->status:Landroid/widget/TextView;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetvault(Lcom/onyx/locker/MainActivity;)Landroid/widget/TextView;
    .locals 0

    iget-object p0, p0, Lcom/onyx/locker/MainActivity;->vault:Landroid/widget/TextView;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$mcacheVault(Lcom/onyx/locker/MainActivity;Ljava/lang/String;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/onyx/locker/MainActivity;->cacheVault(Ljava/lang/String;)V

    return-void
.end method

.method static bridge synthetic -$$Nest$mpost(Lcom/onyx/locker/MainActivity;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    invoke-direct {p0, p1, p2}, Lcom/onyx/locker/MainActivity;->post(Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method static bridge synthetic -$$Nest$msync(Lcom/onyx/locker/MainActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/onyx/locker/MainActivity;->sync()V

    return-void
.end method

.method static bridge synthetic -$$Nest$smmask(Ljava/lang/String;)Ljava/lang/String;
    .locals 0

    invoke-static {p0}, Lcom/onyx/locker/MainActivity;->mask(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method public constructor <init>()V
    .locals 0

    .line 15
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    return-void
.end method

.method private cacheVault(Ljava/lang/String;)V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 86
    const-string v0, "UTF-8"

    invoke-virtual {p1, v0}, Ljava/lang/String;->getBytes(Ljava/lang/String;)[B

    move-result-object p1

    invoke-static {p1}, Lcom/onyx/locker/VaultCrypto;->encrypt([B)[B

    move-result-object p1

    .line 87
    new-instance v0, Ljava/io/FileOutputStream;

    new-instance v1, Ljava/io/File;

    invoke-virtual {p0}, Lcom/onyx/locker/MainActivity;->getFilesDir()Ljava/io/File;

    move-result-object v2

    const-string v3, "vault.enc"

    invoke-direct {v1, v2, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-direct {v0, v1}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    .line 88
    invoke-virtual {v0, p1}, Ljava/io/FileOutputStream;->write([B)V

    .line 89
    invoke-virtual {v0}, Ljava/io/FileOutputStream;->close()V

    .line 90
    return-void
.end method

.method private static mask(Ljava/lang/String;)Ljava/lang/String;
    .locals 3

    .line 93
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    .line 94
    const/4 v1, 0x0

    :goto_0
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v2

    if-ge v1, v2, :cond_0

    const/16 v2, 0x2022

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 95
    :cond_0
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method private post(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1

    .line 99
    new-instance v0, Lcom/onyx/locker/MainActivity$3;

    invoke-direct {v0, p0, p1, p2}, Lcom/onyx/locker/MainActivity$3;-><init>(Lcom/onyx/locker/MainActivity;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {p0, v0}, Lcom/onyx/locker/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 105
    return-void
.end method

.method private sync()V
    .locals 3

    .line 39
    iget-object v0, p0, Lcom/onyx/locker/MainActivity;->status:Landroid/widget/TextView;

    const-string v1, "Syncing vault..."

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 40
    iget-object v0, p0, Lcom/onyx/locker/MainActivity;->session:Lcom/onyx/locker/Session;

    invoke-virtual {v0}, Lcom/onyx/locker/Session;->baseUrl()Ljava/lang/String;

    move-result-object v0

    .line 41
    new-instance v1, Ljava/lang/Thread;

    new-instance v2, Lcom/onyx/locker/MainActivity$2;

    invoke-direct {v2, p0, v0}, Lcom/onyx/locker/MainActivity$2;-><init>(Lcom/onyx/locker/MainActivity;Ljava/lang/String;)V

    invoke-direct {v1, v2}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 82
    invoke-virtual {v1}, Ljava/lang/Thread;->start()V

    .line 83
    return-void
.end method


# virtual methods
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 1

    .line 23
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 24
    new-instance p1, Lcom/onyx/locker/Session;

    invoke-direct {p1, p0}, Lcom/onyx/locker/Session;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/onyx/locker/MainActivity;->session:Lcom/onyx/locker/Session;

    .line 25
    const/high16 p1, 0x7f020000

    invoke-virtual {p0, p1}, Lcom/onyx/locker/MainActivity;->setContentView(I)V

    .line 26
    const/high16 p1, 0x7f010000

    invoke-virtual {p0, p1}, Lcom/onyx/locker/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/EditText;

    iput-object p1, p0, Lcom/onyx/locker/MainActivity;->serverField:Landroid/widget/EditText;

    .line 27
    const p1, 0x7f010001

    invoke-virtual {p0, p1}, Lcom/onyx/locker/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    iput-object p1, p0, Lcom/onyx/locker/MainActivity;->status:Landroid/widget/TextView;

    .line 28
    const p1, 0x7f010003

    invoke-virtual {p0, p1}, Lcom/onyx/locker/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    iput-object p1, p0, Lcom/onyx/locker/MainActivity;->vault:Landroid/widget/TextView;

    .line 29
    iget-object p1, p0, Lcom/onyx/locker/MainActivity;->serverField:Landroid/widget/EditText;

    iget-object v0, p0, Lcom/onyx/locker/MainActivity;->session:Lcom/onyx/locker/Session;

    invoke-virtual {v0}, Lcom/onyx/locker/Session;->baseUrl()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Landroid/widget/EditText;->setText(Ljava/lang/CharSequence;)V

    .line 30
    const p1, 0x7f010002

    invoke-virtual {p0, p1}, Lcom/onyx/locker/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    new-instance v0, Lcom/onyx/locker/MainActivity$1;

    invoke-direct {v0, p0}, Lcom/onyx/locker/MainActivity$1;-><init>(Lcom/onyx/locker/MainActivity;)V

    invoke-virtual {p1, v0}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 36
    return-void
.end method

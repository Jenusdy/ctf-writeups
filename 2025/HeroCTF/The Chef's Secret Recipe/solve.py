def bake(): return chr(0x48)
def perfect(): return chr(0x65)
def sift(): return chr(0x72)
def flour(): return chr(0x6f)
def sugar(): return chr(0x7b)
def crack(): return chr(0x30)
def eggs(): return chr(0x68)
def melt(): return chr(0x5f)
def butter(): return chr(0x4e)
def blend(): return chr(0x30)
def vanilla(): return chr(0x5f)
def milk(): return chr(0x79)
def whisk(): return chr(0x30)
def cocoa(): return chr(0x75)
def fold(): return chr(0x5f)
def baking(): return chr(0x36)
def powder(): return chr(0x30)
def swirl(): return chr(0x54)
def cream(): return chr(0x5f)
def chop(): return chr(0x4d)
def cherry(): return chr(0x79)
def toss(): return chr(0x5f)
def sprinkles(): return chr(0x53)
def preheat(): return chr(0x33)
def oven(): return chr(0x63)
def grease(): return chr(0x52)
def pan(): return chr(0x65)
def line(): return chr(0x54)
def parchment(): return chr(0x5f)

# New functions from your disassembly:
def timer(): return chr(0x43)
def light(): return chr(0x34)
def candle(): return chr(0x6b)
def plate(): return chr(0x33)
def garnish(): return chr(0x5f)
def frosting(): return chr(0x52)
def pinch(): return chr(0x33)
def salt(): return chr(0x63)
def crushed(): return chr(0x31)
def nuts(): return chr(0x70)
def touch(): return chr(0x65)
def sweetness(): return chr(0x7d)

# Build final flag in EXACT recipe order
flag = (
    bake() + perfect() + sift() + flour() + sugar() + crack() + eggs() +
    melt() + butter() + blend() + vanilla() + milk() + whisk() + cocoa() +
    fold() + baking() + powder() + swirl() + cream() + chop() + cherry() +
    toss() + sprinkles() + preheat() + oven() + grease() + pan() +
    line() + parchment() + timer() + light() + candle() + plate() +
    garnish() + frosting() + pinch() + salt() + crushed() + nuts() +
    touch() + sweetness()
)

print(flag)

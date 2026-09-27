import torch
ckpt = torch.load('pytorch_model.bin', weights_only=False)
print(ckpt['val_accuracy'])
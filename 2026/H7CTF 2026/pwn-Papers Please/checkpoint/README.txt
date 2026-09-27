Target: Ubuntu 24.04, glibc 2.39 (2.39-0ubuntu8.9), x86-64.

Files:
  checkpoint                    the challenge binary (also served live on your instance)
  libc.so.6             the exact libc the target runs against
  ld-linux-x86-64.so.2  the matching dynamic loader

Run locally against the provided libc so offsets match the live target:
  patchelf --set-interpreter ./ld-linux-x86-64.so.2 --set-rpath . ./checkpoint && ./checkpoint
  # or, without patchelf:
  ./ld-linux-x86-64.so.2 --library-path . ./checkpoint

The live target is reachable at the host:port shown for your instance.

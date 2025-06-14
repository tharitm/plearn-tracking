"use client"

import { useParcelStore } from "@/stores/parcel-store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { DEFAULT_THUMBNAIL } from "@/lib/constants";

export function ParcelGalleryModal() {
  const { selectedParcel, setSelectedParcel } = useParcelStore();

  if (!selectedParcel) return null;

  const images = selectedParcel.images && selectedParcel.images.length > 0
    ? selectedParcel.images
    : [DEFAULT_THUMBNAIL];

  return (
    <Dialog open={!!selectedParcel} onOpenChange={() => setSelectedParcel(null)}>
      <DialogContent className="max-w-2xl">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`image-${idx}`} className="max-h-[60vh] object-contain" />
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}


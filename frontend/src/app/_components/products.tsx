"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Product } from "~/lib/services/coffee-service";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface ProductRotatorProps {
  products: Product[];
}

export default function Products({ products }: ProductRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (products.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIsTransitioning(true);

      // Wait for fade out before changing index
      setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % products.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);
  }, [products]);

  const handleDotClick = (index: number) => {
    if (index === activeIndex) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
      resetTimer();
    }, 500);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [products.length, resetTimer]);

  if (products.length === 0) {
    return <div className="text-muted-foreground">No products available</div>;
  }

  const activeProduct = products[activeIndex];

  return (
    <Card className="lg:col-span-3 row-span-3 flex flex-col">
      <CardHeader>
        <CardTitle className="text-primary">COFFEE INVENTORY</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col h-full">
          <div
            className={`p-4 transition-opacity duration-1000 flex flex-col flex-grow ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-4 mb-4 flex-grow">
              {activeProduct.image ? (
                <div className="flex items-center justify-center h-60 min-h-48 max-h-72">
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    width={256}
                    height={256}
                    className="object-contain w-auto h-auto min-w-[120px] min-h-[120px] max-w-[256px] max-h-[256px]"
                  />
                </div>
              ) : (
                <div className="text-6xl text-primary">☕</div>
              )}
              <div className="text-center">
                <h3 className="text-foreground font-bold uppercase text-xl">
                  {activeProduct.name}
                </h3>
                <p className="text-primary text-2xl mt-2">
                  ${activeProduct.price.toFixed(2)}
                </p>
              </div>
              <div className="text-muted-foreground text-sm text-center max-w-[80%]">
                <p>{activeProduct.description}</p>
              </div>
            </div>
            <div className="mt-auto pt-4 flex justify-center">
              <div className="flex gap-2">
                {products.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`h-2 w-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                      index === activeIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

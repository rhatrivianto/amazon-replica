import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderClassName = 'bg-gray-100 animate-pulse',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Saat elemen masuk ke viewport
        if (entry.isIntersecting) {
          setIsInView(true);
          // Hentikan observasi setelah gambar terlihat
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 } // Trigger saat 10% gambar terlihat
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Hanya set `src` jika gambar sudah masuk ke dalam view
  const imageSrc = isInView ? src : '';

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder yang akan tampil saat gambar belum dimuat */}
      {!isLoaded && <div className={`absolute inset-0 ${placeholderClassName}`} />}

      {/* Gambar utama dengan efek transisi */}
      <motion.img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
};

export default LazyImage;

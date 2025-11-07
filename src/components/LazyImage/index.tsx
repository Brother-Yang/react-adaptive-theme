import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ComponentProps,
  type FC,
  type HTMLAttributes,
  type CSSProperties,
} from 'react';
import { Skeleton, Image } from 'antd';
import './index.less';

interface LazyImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string; // e.g. '16/9'
  fit?: 'cover' | 'contain';
  placeholder?: ReactNode;
  threshold?: number; // IntersectionObserver threshold
  rootMargin?: string; // IntersectionObserver rootMargin
  rounded?: boolean;
  onLoad?: () => void;
  // 透传给 AntD Image 的全部属性（如 preview、fallback 等）
  imageProps?: ComponentProps<typeof Image>;
}

const LazyImage: FC<LazyImageProps> = ({
  src,
  alt = '',
  width,
  height,
  aspectRatio,
  fit = 'cover',
  placeholder,
  threshold = 0.1,
  rootMargin = '100px',
  rounded = true,
  className,
  style,
  onLoad,
  imageProps,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // 如果浏览器不支持 IntersectionObserver，则直接加载
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const containerStyle: CSSProperties = {
    width,
    height,
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={`lazy-image${rounded ? ' rounded' : ''}${className ? ` ${className}` : ''}`}
      style={containerStyle}
      {...rest}
    >
      {/* 占位内容（默认使用 AntD Skeleton.Image） */}
      {!loaded && (
        <div className={`lazy-image-placeholder${!loaded ? ' visible' : ''}`}>
          {placeholder ?? (
            <Skeleton.Image
              active
              style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
            />
          )}
        </div>
      )}

      {/* 真实图片（默认使用 AntD Image） */}
      {inView && (
        <div
          className={`lazy-image-img${loaded ? ' visible' : ''} ${
            fit === 'contain' ? 'fit-contain' : 'fit-cover'
          }`}
        >
          <Image
            src={src}
            alt={alt}
            preview={imageProps?.preview ?? false}
            onLoad={e => {
              setLoaded(true);
              onLoad?.();
              imageProps?.onLoad?.(e as any);
            }}
            {...imageProps}
          />
        </div>
      )}
    </div>
  );
};

export default LazyImage;

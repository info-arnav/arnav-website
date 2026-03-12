import Link from 'next/link';
import NextImage from 'next/image';
import styles from './mdx.module.css';

function mergeClassNames(...classNames) {
  return classNames.filter(Boolean).join(' ');
}

function Anchor({ className, href = '', rel, target, ...props }) {
  const combinedClassName = mergeClassNames(styles.link, className);
  const isInternalLink = href.startsWith('/');
  const isHashLink = href.startsWith('#');
  const isExternalLink = /^https?:\/\//i.test(href);

  if (isInternalLink) {
    return <Link href={href} className={combinedClassName} {...props} />;
  }

  if (isHashLink) {
    return <a href={href} className={combinedClassName} {...props} />;
  }

  if (!isExternalLink) {
    return <a href={href} className={combinedClassName} {...props} />;
  }

  return (
    <a
      href={href}
      className={combinedClassName}
      rel={rel ?? 'noreferrer noopener'}
      target={target ?? '_blank'}
      {...props}
    />
  );
}

function HeadingOne(props) {
  return <h1 className={styles.headingOne} {...props} />;
}

function HeadingTwo(props) {
  return <h2 className={styles.headingTwo} {...props} />;
}

function HeadingThree(props) {
  return <h3 className={styles.headingThree} {...props} />;
}

function Paragraph(props) {
  return <p className={styles.paragraph} {...props} />;
}

function UnorderedList(props) {
  return <ul className={styles.list} {...props} />;
}

function OrderedList(props) {
  return <ol className={styles.orderedList} {...props} />;
}

function ListItem(props) {
  return <li className={styles.listItem} {...props} />;
}

function Blockquote(props) {
  return <blockquote className={styles.blockquote} {...props} />;
}

function PreformattedText(props) {
  return <pre className={styles.pre} {...props} />;
}

function Code({ className, ...props }) {
  const resolvedClassName = className
    ? mergeClassNames(styles.codeBlock, className)
    : styles.inlineCode;

  return <code className={resolvedClassName} {...props} />;
}

function parseDimension(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue) && parsedValue > 0) {
      return parsedValue;
    }
  }

  return null;
}

function Image({
  alt = '',
  className,
  decoding,
  height,
  loading,
  sizes = '100vw',
  src,
  width,
  ...props
}) {
  const resolvedClassName = mergeClassNames(styles.image, className);
  const resolvedWidth = parseDimension(width);
  const resolvedHeight = parseDimension(height);
  const isStaticImport = typeof src === 'object' && src !== null;
  const canUseNextImage =
    isStaticImport ||
    (typeof src === 'string' &&
      src.length > 0 &&
      resolvedWidth !== null &&
      resolvedHeight !== null);

  if (canUseNextImage) {
    return (
      <NextImage
        alt={alt}
        className={resolvedClassName}
        height={resolvedHeight ?? undefined}
        sizes={sizes}
        src={src}
        width={resolvedWidth ?? undefined}
        {...props}
      />
    );
  }

  return (
    <img
      alt={alt}
      className={resolvedClassName}
      decoding={decoding ?? 'async'}
      loading={loading ?? 'lazy'}
      src={typeof src === 'string' ? src : ''}
      {...props}
    />
  );
}

function HorizontalRule(props) {
  return <hr className={styles.separator} {...props} />;
}

function Table(props) {
  return <table className={styles.table} {...props} />;
}

function TableHeaderCell(props) {
  return <th className={styles.tableHead} {...props} />;
}

function TableCell(props) {
  return <td className={styles.tableCell} {...props} />;
}

export const mdxComponents = {
  Image,
  a: Anchor,
  blockquote: Blockquote,
  code: Code,
  h1: HeadingOne,
  h2: HeadingTwo,
  h3: HeadingThree,
  hr: HorizontalRule,
  img: Image,
  li: ListItem,
  ol: OrderedList,
  p: Paragraph,
  pre: PreformattedText,
  table: Table,
  td: TableCell,
  th: TableHeaderCell,
  ul: UnorderedList,
};

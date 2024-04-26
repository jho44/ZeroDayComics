import styles from "./LoadingCircle.module.css";

export default function LoadingCircle({
  size,
  thickness,
}: {
  size?: string;
  thickness?: string;
}) {
  const width = size ?? "20px";
  const height = width;
  const finalThickness = thickness ?? "2px";

  return (
    <div
      className={styles.loader}
      style={{
        width,
        height,
        border: `${finalThickness} solid #6b7280`,
        borderTop: `${finalThickness} solid #f3f4f6`,
      }}
    ></div>
  );
}

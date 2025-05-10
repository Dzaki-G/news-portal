// pages/index.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    if (router.query.authMessage) {
      setAuthMessage(router.query.authMessage as string);
  
      // Clean up the URL
      router.replace("/", undefined, { shallow: true });
    }
  }, [router.query]);
  

  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.authBox}>
          <img src="/logo1.jpg" alt="NewsLogo" className={styles.logo} />
          <p className={styles.description}>
            News Web Dibuat oleh Dzaki Gastiadirrijal NIM 122140030<br></br>
            Silahkan Login menggunakan Google
          </p>
  
          <button onClick={() => signIn("google")} className={styles.signInButton}>
            Sign in with Google
          </button>
  
          {authMessage && (
            <p className={styles.authMessage}>{authMessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <img src="/logo1.jpg" alt="NewsLogo" className={styles.logo} />
        <h1 className={styles.title}>Selamat datang, {session.user?.name}!</h1>
        <p className={styles.description}>Kamu Sudah Login. Lanjut ke Web berita?</p>
  
        <div className={styles.buttonGroup}>
          <button
            onClick={() => router.push("/news")}
            className={styles.primaryButton}
          >
            Go to News
          </button>
          <button
            onClick={() => signOut()}
            className={styles.secondaryButton}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
  
}

import styles from './Footer.module.css'

export default function Footer () {

    const yearNow = new Date().getFullYear()

    return (
        <div className={styles.container}>
            <div><a href={'https://marcius.lt'}>marcius.lt</a></div>
            <div>{yearNow}</div>
        </div>
    )
}
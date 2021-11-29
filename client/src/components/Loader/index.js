import styles from "./Loader.module.scss"
const Loader = () => {
    return (
        <div className={styles.container}>
            <div className={styles.loader}></div>
            <div className={styles.loader_text}>
                <div>Initial loads may take a few seconds</div>
                <div>Please Wait</div>
            </div>

        </div>
    )
}

export default Loader

import { useState } from 'react';
import '../../styles/common/Style.css'
import translationStyle from '../../styles/translation/translationPage.module.css'

function Translation() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');

    const handleButtonClick = () => {
        setResultText(inputText);
        setInputText(resultText);
    }

    return(
        <div className={translationStyle['container']}>
            <p className={translationStyle['title']}>번역</p>

            <div className={translationStyle['box']}>
                <div className={translationStyle['input']}>
                    <input
                        className={translationStyle['input-text']}
                        placeholder='Enter text'
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>

                <div className={translationStyle['change']}>
                    <div className={translationStyle['change-img']}>
                        <img
                            src={process.env.PUBLIC_URL + '/images/change.png'}
                            onClick={handleButtonClick}
                        />
                    </div>
                </div>

                <div className={translationStyle['result']}>
                    <input
                        className={translationStyle['result-text']}
                        placeholder='텍스트 입력'
                        value={resultText}
                        onChange={(e) => setResultText(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Translation;
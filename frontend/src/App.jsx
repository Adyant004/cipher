import { useState } from "react";
import "./App.css";
import useCaeser from "./hooks/useCaeser";
import useAffine from "./hooks/useAffine";
import useSubstitution from "./hooks/useSubstitution";
import useVigKasiski from "./hooks/useVigKasiski";
import useVigIC from "./hooks/useVigIC";

function App() {
  const [cipher, setCipher] = useState("");
  const [text, setText] = useState(null);
  const [flag, setFlag] = useState(0);

  const { caeserCipher } = useCaeser();
  const { affinecipher } = useAffine();
  const { subsCipher } = useSubstitution();
  const { vigKasiski } = useVigKasiski();
  const { vigIC } = useVigIC();

  const c1 = async () => {
    const data = await caeserCipher(cipher);
    setText(data);
  };

  const c2 = async () => {
    const data = await subsCipher(cipher);
    setText(data);
    setFlag(1);
  };

  const c3 = async () => {
    const data = await affinecipher(cipher);
    setText(data);
    setFlag(1);
  };

  const c4 = async () => {
    const data = await vigKasiski(cipher);
    setText(data);
    setFlag(2);
  };

  const c5 = async () => {
    const data = await vigIC(cipher);
    setText(data);
    setFlag(2);
  };

  return (
    <div>
      <div className="navbar bg-base-300 rounded-box">
        <div className="flex-1 px-2 lg:flex-none">
          <a className="text-lg font-bold">Ciphers</a>
        </div>
        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch gap-4">
            <input
              value={cipher}
              onChange={(e) => setCipher(e.target.value)}
              type="text"
              placeholder="Enter cipher text here"
              className="input input-bordered w-full max-w-xs"
            />
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost rounded-btn"
              >
                Cipher Options
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
              >
                <li>
                  <a onClick={() => c1()}>Caeser Cipher</a>
                </li>
                <li>
                  <a onClick={() => c2()}>Substitution Cipher</a>
                </li>
                <li>
                  <a onClick={() => c3()}>Affine Cipher</a>
                </li>
                <li>
                  <a onClick={() => c4()}>Vignere Cipher with Kasiski Method</a>
                </li>
                <li>
                  <a onClick={() => c5()}>Vignere Cipher with IC</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {text !== "" ? (
        <>
          <div className="m-16">
            {Array.isArray(text) === true && <> 
          Brute Force : {"\t"}
            {
              text.map((t) => (
                <div key={t}>
                  <span >{t + "\n"}</span>
                </div>
              ))
            }
          </>
          }

          {
            Array.isArray(text) === false && flag === 1 && (
              
             <span>Plaintext : {text}{console.log(text)}</span>
            )
          }

          {
           Array.isArray(text) === false && flag === 2 && (
            <div>
              <span>Key : {text.key}</span>
              <span>Plaintext : {text.plaintext}</span>
            </div>
           )
          }

          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;

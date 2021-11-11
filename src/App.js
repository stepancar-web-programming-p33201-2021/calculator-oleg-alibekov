import React, {useState} from "react";

import Wrapper from "./components/Wrapper";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import "./components/Screen.css";

const btnValues = [
    ["C", "^", "%", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "="],
];

const toLocaleString = (num) =>
    String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const App = () => {

    const [calc, setCalc] = useState({
        sign: "",
        num: 0,
        res: 0,
    });

    const numClickHandler = (e) => {
        e.preventDefault();

        const value = e.type === 'click' ? e.target.innerHTML : e.key;

        if (removeSpaces(calc.num).length < 16) {
            setCalc({
                ...calc,
                num:
                    calc.num === 0 && value === "0"
                        ? "0"
                        : removeSpaces(calc.num) % 1 === 0
                            ? toLocaleString(Number(removeSpaces(calc.num + value)))
                            : toLocaleString(calc.num + value),
                res: !calc.sign ? 0 : calc.res,
            });
        }
    };

    const comaClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc,
            num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
        });
    };

    const signClickHandler = (e) => {
        setCalc({
            ...calc,
            sign: e.target.innerHTML,
            res: !calc.res && calc.num ? calc.num : calc.res,
            num: 0,
        });
    };

    const equalsClickHandler = () => {
        if (calc.sign && calc.num) {
            const math = (a, b, sign) =>
                sign === "^"
                    ? Math.pow(a, b) :
                    sign === "+"
                        ? a + b
                        : sign === "-"
                            ? a - b
                            : sign === "X"
                                ? a * b
                                : a / b;

            setCalc({
                ...calc,
                res:
                    calc.num === "0" && calc.sign === "/"
                        ? "Can't divide with 0"
                        : toLocaleString(
                            math(
                                Number(removeSpaces(calc.res)),
                                Number(removeSpaces(calc.num)),
                                calc.sign
                            )
                        ),
                sign: "",
                num: 0,
            });
        }
    };

    const percentClickHandler = () => {
        let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
        let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
        setCalc({
            ...calc,
            num: (num /= Math.pow(100, 1)),
            res: (res /= Math.pow(100, 1)),
            sign: "",
        });
    };

    const resetClickHandler = () => {
        setCalc({
            ...calc,
            sign: "",
            num: 0,
            res: 0,
        });
    };

    const handleButtonClick = (btn) => {
        return btn === "C"
            ? resetClickHandler
            : btn === "^"
                ? signClickHandler
                : btn === "%"
                    ? percentClickHandler
                    : btn === "="
                        ? equalsClickHandler
                        : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                            ? signClickHandler
                            : btn === "."
                                ? comaClickHandler
                                : numClickHandler;
    }

    const inputOnKeyDown = (e) => {
        e.preventDefault();
        const value = e.key;
        if (!isNaN(value)) {
            numClickHandler(e)
        }
    }

    return (
        <Wrapper>
            <form>
                <label>
                    <input className="screen" type="text" name="name" tabIndex="-1"
                           value={calc.num ? calc.num : calc.res}
                           onKeyDown={((e) => {
                               inputOnKeyDown(e)
                           })}/>
                </label>
            </form>
            <ButtonBox>
                {btnValues.flat().map((btn, i) => {
                    return (
                        <Button
                            key={i}
                            className={btn === "=" ? "equals" : ""}
                            value={btn}
                            onClick={handleButtonClick(btn)}
                        />
                    );
                })}
            </ButtonBox>
        </Wrapper>
    );
};


export default App;

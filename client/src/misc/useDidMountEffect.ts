/* eslint-disable react-hooks/exhaustive-deps */
import { DependencyList, EffectCallback, useEffect, useRef } from "react";

const useDidMountEffect = (func: EffectCallback, deps: DependencyList) => {
  const didMount = useRef(false);

  useEffect(() => {
    // console.log({ deps, didMount }, "didMount");
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMountEffect;

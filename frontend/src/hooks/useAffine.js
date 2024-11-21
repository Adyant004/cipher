const useAffine = () => {
  const affinecipher = async (ciphertext) => {
    try {
      const res = await fetch("http://localhost:5000/cipher/affine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ciphertext }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.log("Error in affine cipher");
    }
  };

  return { affinecipher };
};

export default useAffine;

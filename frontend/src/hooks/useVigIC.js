
const useVigIC = () => {

    const vigIC = async (ciphertext) => {
        try {
            const res = await fetch("http://localhost:5000/cipher/vignere/ic",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ ciphertext })
            }) 

            const data = await res.json();

            if(data.error){
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.log("Error in IC Method");
        }
    }

  return { vigIC };
}

export default useVigIC

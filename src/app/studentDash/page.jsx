"use client";
import React, { useState, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import Card from "../components/SDashboard/Card";
import BasicArea from "../components/SDashboard/LineChart";
import * as fcl from "@onflow/fcl";
import { useRouter } from "next/navigation";
import { db } from "../firebase/config";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
function page() {
  let [sName, setSName] = useState("");
  let [sMail, setSMail] = useState("");
  let [mintScore, setMintScore] = useState(0);
  const [user, setUser] = useState("");
  const [visible, setvisible] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if(!user.addr){
    fcl.currentUser().subscribe(setUser);
    }
    getStudents();
  }, [user]);
 
  
  async function getStudents() {
    const q = query(collection(db, "students"));
    let arr = [],
      arr2 = [];
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        arr.push(doc.data().walletAddress);
        arr2.push(doc.data());
      });
      console.log(arr);
      console.log(user.addr)
      if (arr.includes(user.addr)) {
        setvisible(false);
        const userDetail = arr2.filter(
          (item) => (item.walletAddress == user.addr)
        );
        console.log(userDetail);
        setSName(userDetail[0].name);
      }
    });
  }
  const sendData = async (e) => {
    e.preventDefault();
    console.log("name", sName);
    console.log("email", user.services[0].scoped.email);
    console.log("wallet Address", user.addr);
    const studentData = {
      name: sName,
      email: user.services[0].scoped.email,
      walletAddress: user.addr,
    };
    await addDoc(collection(db, "students"), studentData);
    console.log("added successfull");
    localStorage.setItem("name", sName);
    setvisible(false);
  };
  return (
    <>
      <main className="w-screen h-auto overflow-hidden flex flex-col items-center justify-center pt-8 gap-8">
        {visible == false && (
          <button
            type="button"
            onClick={() => {
              fcl.unauthenticate();
              localStorage.setItem("Vault", "");
              router.push("/");
            }}
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          >
            Logout
          </button>
        )}
        <div className="w-full px-60 flex items-center justify-between">
          <span className="flex items-center justify-center">
            <FaRegUserCircle className="text-white text-7xl" />
            <span className="ml-4 flex flex-col items-center justify-center">
              <h1 className="gilroy-bold capitalize text-3xl text-white">
                welcome, {sName}
              </h1>
              <p className="gilroy-light text-sm text-white mt-2">{sMail}</p>
            </span>
          </span>
          {visible == true && (
            <div className="flex flex-col gap-2 items-end" action="">
              <span>
                <label className="gilroy-light text-white text-xl ">
                  Name :
                </label>
                <input
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  className="bg-slate-400 rounded-lg gilroy-light px-4"
                  type="text"
                />
              </span>
              <button
                className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center w-20"
                type="submit"
                onClick={sendData}
              >
                Submit
              </button>
            </div>
          )}
        </div>

        {/* <div className="w-5/6 mt-8 flex items-center justify-start gap-8 flex-wrap">
          
        </div> */}
        <span className="flex gap-16 w-screen px-60 mt-10 z-10">
          <BasicArea />
          <div className="w-full bg-gray-500/50 border-2 border-blue-500 flex flex-col items-center justify-between pt-8 pb-16 px-6 rounded-lg z-10">
            <h1 className="gilroy-bold text-4xl text-white">Mint Score</h1>
            <div className=" w-60 h-60 border-4 border-blue-500 rounded-full flex items-center justify-center">
              <h1 className="gilroy-bold text-4xl text-white">100</h1>
            </div>
            <div className="border-t-2 w-full"></div>
          </div>
        </span>
        <div className="w-full px-60 z-10">
          <div className="w-full bg-gray-500/50 border-2 border-blue-500 flex flex-col items-center justify-between py-8 px-6 rounded-lg z-10">
            <h1 className="gilroy-bold text-4xl text-white">
              Flow Tokens Earned
            </h1>
            <h1 className="text-white text-3xl mt-8">123</h1>
          </div>
        </div>
      </main>
      <div className="circle absolute top-0 z-0 "></div>
      <div className="circle absolute top-80 left-10 z-0"></div>
      <div className="circle absolute top-60 right-40 z-0"></div>
      <div className="circle absolute top-96 right-20 z-0"></div>
      <div className="circle absolute -bottom-20 left-60 z-0"></div>
    </>
  );
}

export default page;

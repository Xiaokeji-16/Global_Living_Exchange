"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import HouseAnimation from "@/public/House_lottie_Animation.json";

interface AuthBrandPanelProps {
  variant?: "sign-in" | "sign-up";
  showHouseAnimation?: boolean;
}

export function AuthBrandPanel({
  variant = "sign-in",
  showHouseAnimation = true,
}: AuthBrandPanelProps) {
  const isSignUp = variant === "sign-up";

  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-[#234B45] via-[#2F6B62] to-[#4B7269] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[rgba(198,123,92,0.18)] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col justify-between px-12 xl:px-20 py-12 w-full h-full">
        {/* Logo - 使用 SVG */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center p-2">
            <Image
              src="/icon/home_app_logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <span className="text-2xl font-semibold text-white">
            Global Living Exchange
          </span>
        </div>

        {/* 中间内容 */}
        <div className="flex-1 flex flex-col justify-center py-6">
          {/* 标题 */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-[-0.02em] mb-4 max-w-[550px]">
            {isSignUp ? (
              <>
                Join our <span className="text-[#F2C9B6]">global</span>
                <br />
                community today.
              </>
            ) : (
              <>
                Live like a <span className="text-[#F2C9B6]">local</span>
                <br />
                anywhere in the world.
              </>
            )}
          </h1>

          <p className="text-lg text-white/80 max-w-md mb-6 leading-7">
            {isSignUp
              ? "Create your account and start exchanging homes with verified members worldwide."
              : "Join our trusted community of verified homeowners. Exchange homes, earn points, and travel without hotels."}
          </p>

          {/* 图片展示 + 验证徽章 */}
          <div className="relative h-[280px] xl:h-[320px]">
            {/* 图片 1 */}
            <div className="absolute left-0 top-0 w-56 xl:w-64 h-40 xl:h-44 rounded-[22px] overflow-hidden shadow-2xl -rotate-6 transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] cursor-pointer">
              <Image
                src="/icon/home1.png"
                alt="Beautiful home 1"
                fill
                className="object-cover"
              />
            </div>

            {/* 图片 2 */}
            <div className="absolute left-40 xl:left-48 top-16 w-60 xl:w-72 h-44 xl:h-52 rounded-[22px] overflow-hidden shadow-2xl rotate-3 z-10 transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] cursor-pointer">
              <Image
                src="/icon/home2.png"
                alt="Beautiful home 2"
                fill
                className="object-cover"
              />
            </div>

            {/* 图片 3 */}
            <div className="absolute left-16 xl:left-20 top-44 xl:top-48 w-56 xl:w-64 h-40 xl:h-44 rounded-[22px] overflow-hidden shadow-2xl -rotate-3 transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] cursor-pointer">
              <Image
                src="/icon/home3.png"
                alt="Beautiful home 3"
                fill
                className="object-cover"
              />
            </div>

            {/* 验证徽章 - 在图片 2 和 3 的右侧 */}
            <div className="absolute left-[340px] xl:left-[420px] top-40 xl:top-44 bg-white rounded-[20px] px-4 py-3 shadow-xl flex items-center gap-3 rotate-6 z-20 transition-all duration-300 hover:rotate-0 hover:scale-105 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[rgba(47,107,98,0.12)] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[rgb(var(--color-primary))]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  100% Verified
                </p>
                <p className="text-xs text-gray-500">Trusted community</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部：统计数据 + House 动画 */}
        <div className={showHouseAnimation ? "flex items-center justify-between -mt-4" : "-mt-4"}>
          {/* 统计数据 */}
          <div className="flex gap-10 xl:gap-12">
            <div>
              <p className="text-3xl xl:text-4xl font-bold text-white">50+</p>
              <p className="text-sm text-white/70 mt-1">Countries</p>
            </div>
            <div>
              <p className="text-3xl xl:text-4xl font-bold text-white">10K+</p>
              <p className="text-sm text-white/70 mt-1">Members</p>
            </div>
            <div>
              <p className="text-3xl xl:text-4xl font-bold text-white">24/7</p>
              <p className="text-sm text-white/70 mt-1">Support</p>
            </div>
          </div>

          {showHouseAnimation && (
            <div className="w-[400px] xl:w-[500px] -mb-12 -mr-8">
              <Lottie
                animationData={HouseAnimation}
                loop={true}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

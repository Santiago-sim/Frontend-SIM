import React from "react";
import Link from "next/link";
import Virgula from "./ui/maya";
import Image from "next/image";

interface NewsItem {
  title: string;
  link: string;
  date: string;
}

const News = () => {
  const newsItems: NewsItem[] = [
    {
      title: "2025 Beijing Megalights Wonderland kick off until March",
      link: "/china-travel-news/2025-beijing-megalights-wonderland-kick-off-until-march.html",
      date: "03 Jan 25",
    },
    {
      title: "China visa-free transit stay duration extend to 240 hours",
      link: "/china-travel-news/china-visa-free-transit-stay-duration-extend-to-240-hours.html",
      date: "25 Dec 24",
    },
    {
      title:
        "China visa-free countries expand to 38, stay duration extend to 30",
      link: "/china-travel-news/china-visa-free-countries-expand-to-38-stay-duration-extend-to-30.html",
      date: "09 Dec 24",
    },
    {
      title: "The 26th Harbin Ice and Snow World to open in mid-December",
      link: "/china-travel-news/the-26th-harbin-ice-world-to-open-in-mid-december.html",
      date: "08 Nov 24",
    },
    {
      title:
        "China decides to trial visa-free policy for Slovakia and other 8 countries",
      link: "/china-travel-news/china-decides-to-trial-visa-free-policy-for-slovakia-and-other-8-countries.html",
      date: "04 Nov 24",
    },
    {
      title: "Chengdu-Vienna direct flight will open on 1 December",
      link: "/china-travel-news/chengdu-vienna-direct-flight-will-open-on-1-december.html",
      date: "01 Nov 24",
    },
  ];

  return (
    <section className="w-full py-16">
      <div className="max-w-auto lg:w-4/5 px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* Left Advertisement Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <Link
              href="https://www.jnsheji.cn/book/hMv4b1u0lv"
              className="block w-[300px]"
            >
              <div className="relative w-[300px] h-[300px]">
                <Image
                  src="https://pic2.cits.net/Images/2022/10/19/1222167285deb55ab-f_Cut300300.jpg"
                  alt="Jiangsu"
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <Link 
              href="https://www.cinaviaggio.com/" 
              className="block w-[300px]"
            >
              <div className="relative w-[300px] h-[300px]">
                <Image
                  src="https://pic2.cits.net/Images/2023/7/3/10425013fed1b3c2-8_Cut300300.jpg"
                  alt="意大利语站"
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          </div>

          {/* News Section */}
          <div className="shadow-lg bg-white">
            <div className="lg:ml-6 lg:mr-6">
              <h2 className="text-4xl mb-4 text-center">
                <Link
                  href="/china-travel-news/"
                  className="hover:text-blue-600"
                >
                  News
                </Link>
              </h2>
              <Virgula />
              <ul className="space-y-4 py-6 ml-12">
                {newsItems.map((item, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={item.link}
                        className="text-gray-800 hover:text-blue-600 transition-colors duration-200 block text-sm"
                      >
                        {item.title}
                      </Link>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Advertisement Section */}
          <div className="flex justify-center lg:justify-start">
            <Link 
              href="https://discoverthenewbeijing.visitbeijing.com.cn/#/"
              className="block w-[300px]"
            >
              <div className="relative w-[300px] h-[620px]">
                <Image
                  src="https://pic2.cits.net/Images/2023/6/28/171173449bceaaa-d_Cut300620.jpg"
                  alt="Discover the new Beijing"
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
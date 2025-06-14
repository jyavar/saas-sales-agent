"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Users,
  Mail,
  DollarSign,
  ArrowUpRight,
  Activity,
  Target,
  Zap,
  BarChart3,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react"

export default function DashboardPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Live Dashboard Preview
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Watch Your AI Sales Agent in Action
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            This is what happens when your AI Sales Agent is qualifying leads and booking demos 24/7
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Browser Frame */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-t-xl p-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-600 rounded px-3 py-1 mx-4">
              <span className="text-sm text-gray-500 dark:text-gray-300">strato-ai.com/dashboard</span>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="bg-white dark:bg-gray-900 rounded-b-xl border border-gray-200 dark:border-gray-700 p-6 shadow-2xl">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your AI performance</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 animate-pulse">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Qualified Demos Booked</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">23</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">+8 this month</span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-500 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Leads Qualified</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">89</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">+24 this month</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Response Rate</p>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">68%</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-600">+12% this month</span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Conversations</p>
                      <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">34</p>
                      <div className="flex items-center mt-2">
                        <Zap className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-600">Ongoing now</span>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Growth</h4>
                    <Badge variant="outline">Last 30 days</Badge>
                  </div>
                  <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Interactive Chart</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Revenue trending upward 📈</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Activity</h4>
                  <div className="space-y-4">
                    {[
                      {
                        icon: MessageSquare,
                        text: "AI Sales Agent qualified new lead from pricing page",
                        time: "3 min ago",
                        color: "text-green-500",
                      },
                      {
                        icon: Calendar,
                        text: "Demo automatically booked with TechCorp",
                        time: "12 min ago",
                        color: "text-blue-500",
                      },
                      {
                        icon: Users,
                        text: "Lead asked about API integration - AI responded",
                        time: "18 min ago",
                        color: "text-purple-500",
                      },
                      {
                        icon: MessageSquare,
                        text: "Prospect qualified as high-intent buyer",
                        time: "25 min ago",
                        color: "text-green-500",
                      },
                      {
                        icon: Mail,
                        text: "Follow-up sequence started for warm lead",
                        time: "32 min ago",
                        color: "text-orange-500",
                      },
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className={`p-1 rounded ${activity.color}`}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Your Dashboard Now
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
